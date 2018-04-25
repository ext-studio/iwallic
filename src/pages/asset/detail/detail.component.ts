import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, NavController, NavParams, Refresher } from 'ionic-angular';
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
    public enabled: boolean = true;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams
    ) {
        this.token = navParams.get('token');
        this.assetName = navParams.get('name');
    }

    public ngOnInit() {
        this.receipt = TxReceiptComponent;
        this.transfer = TxTransferComponent;
        this.items = [];
        for (let i = 0; i < 5; i++) {
            this.items.push(this.items.length);
        }

    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        console.log('Begin async operation');
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.items.length >= 20) {
                    this.enabled = false;
                }
                for (let i = 0; i < 5; i++) {
                    this.items.push(this.items.length);
                }
                console.log('Async operation has ended');
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
