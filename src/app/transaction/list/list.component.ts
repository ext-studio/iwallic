import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService, HttpService } from 'app/core';
import { WalletService } from '../../neo';
import { Router } from '@angular/router';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    public list = [];
    public totalPage = 1;

    public page = 1;
    private take = 15;
    private nomore = false;
    constructor(
        private dialog: DialogService,
        private http: HttpService,
        private wallet: WalletService,
        private router: Router
    ) {}
    ngOnInit() {
        this.dialog.loader().then((loader) => {
            this.fetch(1).subscribe((res) => {
                loader.dismiss();
                this.list = res;
            }, (err) => {
                loader.dismiss();
                this.dialog.toast('Fetch failed.');
            });
        });
    }

    public browse(txid: string) {
        // todo link to blolys
        console.log('browse: '+ txid);
    }

    public copyTx(txid: string, target) {
        // todo copy for native platform
        console.log('copy: '+txid);
        target.target.close();
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

    public unconfirmed() {
        this.router.navigate(['/transaction/unconfirmed']);
    }

    private fetch(page: number): Observable<any[]> {
        this.page = page;
        return this.http.get(`/client/transaction/list?page=${page}&page_size=${this.take}&wallet_address=${this.wallet.address}&confirmed=true`).pipe(map((res) => {
            this.totalPage = res.pages;
            this.nomore = res.page >= this.totalPage || !res.items.length;
            return res.items;
        }));
    }
}
