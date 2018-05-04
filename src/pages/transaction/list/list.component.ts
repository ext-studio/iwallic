import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, Refresher, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core';
import { WalletService } from '../../../neo';


@Component({
    selector: 'transaction-list',
    templateUrl: 'list.component.html'
})
export class TxListComponent implements OnInit {
    public items: any[] = [];
    public enabled: boolean = true;
    public address: string = '';
    public page: number = 1;
    public pageSize: number = 5;

    constructor(
        private http: HttpClient,
        private global: GlobalService,
        private wallet: WalletService,
        private platform: Platform
    ) { }

    public ngOnInit() {
        const tempsize = (((this.platform.height() - 44) / 60) + 1).toString();
        this.pageSize = parseInt(tempsize, 0);
        this.wallet.Get().subscribe((res) => {
            this.address = res.account.address;
            this.getTxList();
        });
    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.getTxList();
                infiniteScroll.complete();
            }, 500);
        });
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            refresher.complete();
        }, 500);
    }

    public getTxList() {
        this.http.post(this.global.apiAddr + '/api/block',
            { 'method': 'getassetchanges', 'params': [this.page, this.pageSize, this.address] }).subscribe(result => {
                if (result['result']['data']) {
                    for (let i = 0; i < result['result']['data'].length; i++) {
                        this.items.push(result['result']['data'][i]);
                    }
                } else {
                    this.enabled = false;
                }
            }, (err) => {
                console.log(err);
            });
        return;
    }
}
