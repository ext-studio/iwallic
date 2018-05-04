import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, NavController, NavParams, Refresher, Platform } from 'ionic-angular';
import { TxReceiptComponent, TxTransferComponent } from '../../../pages';

@Component({
    selector: 'asset-detail',
    templateUrl: 'detail.component.html'
})
export class AssetDetailComponent implements OnInit {
    public items: any[];
    public receipt: any;
    public transfer: any;
    public token: string;
    public assetName: string;
    public assetValue: number = 0;
    public enabled: boolean = true;
    public pageSize: number = 5;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private platform: Platform
    ) {
        this.token = navParams.get('token');
        this.assetName = navParams.get('name');
        this.assetValue = navParams.get('assetValue');
    }

    public ngOnInit() {
        this.receipt = TxReceiptComponent;
        this.transfer = TxTransferComponent;
        this.items = [];
        const tempsize = (((this.platform.height() - 230 - 44 - 20) / 60) + 1).toString();
        this.pageSize = parseInt(tempsize, 0);
        for (let i = 0; i < this.pageSize; i++) {
            this.items.push(this.items.length);
        }
    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                for (let i = 0; i < this.pageSize; i++) {
                    this.items.push(this.items.length);
                }
                infiniteScroll.complete();
            }, 500);
        });
    }
    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            refresher.complete();
        }, 500);
    }
}
