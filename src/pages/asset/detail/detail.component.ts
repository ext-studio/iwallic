import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, NavController, NavParams, Refresher, Platform } from 'ionic-angular';
import { TxReceiptComponent, TxTransferComponent } from '../../../pages';
import { WalletService } from '../../../neo';
import { TransactionState } from '../../../core';

@Component({
    selector: 'asset-detail',
    templateUrl: 'detail.component.html',
    providers: [TransactionState]
})
export class AssetDetailComponent implements OnInit {
    public items: any = [];
    public receipt = TxReceiptComponent;
    public transfer = TxTransferComponent;
    public token: string;
    public assetName: string;
    public assetBalance: number = 0;
    public address: string;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private platform: Platform,
        private wallet: WalletService,
        private transcation: TransactionState
    ) {}
    public ngOnInit() {
        this.token = this.navParams.get('token');
        this.assetName = this.navParams.get('name');
        this.assetBalance = this.navParams.get('assetBalance');
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.transcation.get(wal.address, this.token).subscribe((res) => {
                this.items = res;
            });
        });
    }

    public loadMore() {
        return this.transcation.fetch(true);
    }

    public jumpTx() {
        this.navCtrl.push(TxTransferComponent, {
            asset: this.token,
            assetName: this.assetName,
            assetBalance: this.assetBalance
        });
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.transcation.fetch().then(() => {
                refresher.complete();
            });
        }, 500);
    }
}
