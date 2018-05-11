import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, Refresher, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core';
import { WalletService, TransactionService } from '../../../neo';


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
        private platform: Platform,
        private transcation: TransactionService
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
                resolve();
            }, 500);
        });
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.page = 1;
            this.items = [];
            this.enabled = true;
            this.getTxList();
            refresher.complete();
        }, 500);
    }

    public getTxList() {
        this.http.post(this.global.apiAddr + '/api/iwallic',
            { 'method': 'getaccounttxes', 'params': [this.page, this.pageSize, this.address] }).subscribe(res => {
                if (res['result']) {
                    if (res['result']['data'] != null) {
                        if (res['result']['data'].length === 0) {
                            this.enabled = false;
                        }
                        for (let i = 0; i < res['result']['data'].length; i++) {
                            this.items.push(res['result']['data'][i]);
                        }
                        this.page += 1;
                    }
                } else {
                    this.enabled = false;
                }
            }, (err) => {
                this.global.Alert('REQUESTFAILED').subscribe();
            });
        return;
    }
}
