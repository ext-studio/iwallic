import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location }  from '@angular/common';
import { DialogService, HttpService } from 'app/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WalletService } from 'app/neo';

@Component({
    templateUrl: 'detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    public assetSymbol = '';
    public assetBalance = '0';
    private address = '';
    public assetId = '';
    public list = [];
    public totalPage = 1;

    public page = 1;
    private take = 15;
    private nomore = false;
    constructor(
        private aRoute: ActivatedRoute,
        private location: Location,
        private dialog: DialogService,
        private http: HttpService,
        private wallet: WalletService
    ) {}
    ngOnInit() {
        this.aRoute.queryParamMap.subscribe((res) => {
            this.assetSymbol = res.get('symbol');
            this.assetBalance = res.get('balance');
            this.assetId = res.get('asset');
            if (!this.assetId.length) {
                this.dialog.toast('Params error.');
                this.location.back();
                return;
            }
            this.dialog.loader().then((loader) => {
                this.fetch(1).subscribe((res) => {
                    loader.dismiss();
                    this.list = res;
                }, (err) => {
                    loader.dismiss();
                    this.dialog.toast('Fetch failed.');
                });
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

    private fetch(page: number): Observable<any[]> {
        this.page = page;
        return this.http.get(`/client/transaction/list?page=${page}&page_size=${this.take}&wallet_address=${this.wallet.address}&asset_id=${this.assetId}&confirmed=true`).pipe(map((res) => {
            this.totalPage = res.pages;
            this.nomore = res.page >= this.totalPage || !res.items.length;
            return res.items;
        }));
    }
}
