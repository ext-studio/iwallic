import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, Refresher, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService, TransactionState } from '../../../core';
import { WalletService, TransactionService } from '../../../neo';


@Component({
    selector: 'transaction-list',
    templateUrl: 'list.component.html'
})
export class TxListComponent implements OnInit {
    public items: any[] = [];
    public address: string = '';

    constructor(
        private http: HttpClient,
        private global: GlobalService,
        private wallet: WalletService,
        private platform: Platform,
        public transcation: TransactionState
    ) { }

    public ngOnInit() {
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.transcation.get(wal.address).subscribe((res: any[]) => {
                this.items = res;
            });
        });
    }

    public loadMore() {
        return this.transcation.fetch(true);
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.transcation.fetch().then(() => {
                refresher.complete();
            });
        }, 500);
    }
}
