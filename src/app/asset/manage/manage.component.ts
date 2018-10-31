import { Component, OnInit } from '@angular/core';
import { HttpService, DialogService } from 'app/core';
import { Storage } from '@ionic/storage';
import { Refresher } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: 'manage.component.html',
    styleUrls: ['manage.component.scss']
})
export class ManageComponent implements OnInit {
    public watching = [];
    public list = [];
    public totalPage = 1;

    public page = 1;
    private take = 15;
    private nomore = false;

    constructor(
        private http: HttpService,
        private storage: Storage,
        private dialog: DialogService
    ) {
        this.storage.get('asset_watch').then((res) => {
            if (res instanceof Array && res.length) {
                this.watching = res;
            }
        });
        this.dialog.loader('Loading').then((loader) => {
            this.fetch(1).subscribe((res) => {
                this.list = res;
                loader.dismiss();
            }, (err) => {
                this.dialog.toast('Load failed.');
                console.log(err);
                loader.dismiss();
            });
        });
    }

    ngOnInit(): void { }

    public toggle(e: any, i: number) {
        const index = this.watching.findIndex((el) => el['asset_id'] == this.list[i].asset_id);
        if (index >= 0) {
            this.watching.splice(index);
        } else {
            this.watching.push({asset_id: this.list[i].asset_id, balance: 0, name: this.list[i].name, symbol: this.list[i].symbol});
        }
        this.storage.set('asset_watch', this.watching);
    }
    public refresh(event) {
        this.fetch(1).subscribe((res) => {
            this.list = res;
            event.target.complete();
        }, (err) => {
            this.dialog.toast('Load failed.');
            event.target.cancel();
            console.log(err);
        });
    }
    public more(event) {
        if (this.nomore) {
            event.target.complete();
            return;
        }
        this.fetch(this.page+1).subscribe((res) => {
            this.list = this.list.concat(res);
            event.target.complete();
        }, (err) => {
            this.dialog.toast('Load failed.');
            console.log(err);
            event.target.complete();
        });
    }
    public trash() {
        this.dialog.confirm(
            'Sure to clean all watching asset?(Just hide from home page, no effect for balance)',
            'Notice',
            'Clean',
            'Cancel'
        ).then((confirm) => {
            if (confirm) {
                this.dialog.loader().then((loader) => {
                    this.storage.remove('asset_watch');
                    this.watching = [];
                    this.fetch(1).subscribe((res) => {
                        loader.dismiss();
                        this.list = res;
                    });
                    this.dialog.toast('Done!');
                });
            }
        })
    }
    private fetch(page: number): Observable<any[]> {
        this.page = page;
        return this.http.get(`/client/assets/list?page=${page}&page_size=${this.take}`).pipe(map((res) => {
            this.totalPage = res.pages;
            this.nomore = res.page >= this.totalPage || !res.items.length;
            return res.items.map((e) => {
                e['chosen'] = this.watching.findIndex((i) => i['asset_id'] == e['asset_id']) >= 0;
                return e;
            });
        }));
    }
}
