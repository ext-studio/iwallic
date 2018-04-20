import { Component, OnInit } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import {
    WalletHomeComponent
} from '../../../pages';

@Component({
    selector: 'asset-detail',
    templateUrl: 'detail.component.html'
})
export class AssetDetailComponent implements OnInit {
    constructor() { }
    public items: any[];
    public tab1: any;
    public tab2: any;
    public ngOnInit() {
        this.tab1 = WalletHomeComponent;
        this.tab2 = WalletHomeComponent;
        this.items = [];
        for (let i = 0; i < 5; i++) {
            this.items.push(this.items.length);
        }

    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        console.log('Begin async operation');
        this.items = [];
        return new Promise((resolve) => {
            setTimeout(() => {
                for (let i = 0; i < 5; i++) {
                    this.items.push(this.items.length);
                }
                console.log('Async operation has ended');
                this.infinitescroll.complete();
            }, 300);
        });
    }
}
