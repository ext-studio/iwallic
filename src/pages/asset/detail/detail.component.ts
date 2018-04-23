import { Component, OnInit } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { TxReceiptComponent, TxTransferComponent } from '../../../pages';

@Component({
    selector: 'asset-detail',
    templateUrl: 'detail.component.html'
})
export class AssetDetailComponent implements OnInit {
    constructor() { }
    public items: any[];
    public receipt: any;
    public transfer: any;
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
                for (let i = 0; i < 5; i++) {
                    this.items.push(this.items.length);
                }
                console.log('Async operation has ended');
                infiniteScroll.complete();
            }, 500);
        });
    }
}
