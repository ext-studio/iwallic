import { Component, OnInit } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';

@Component({
    selector: 'transaction-list',
    templateUrl: 'list.component.html'
})
export class TxListComponent implements OnInit {
    public items: any[];
    public enabled: boolean = true;

    constructor() {}

    public ngOnInit() {
        this.items = [];
        for (let i = 0; i < 10; i++) {
            this.items.push(this.items.length);
        }

    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        console.log('Begin async operation');
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.items.length >= 30) {
                    this.enabled = false;
                }
                for (let i = 0; i < 10; i++) {
                    this.items.push(this.items.length);
                }
                console.log('Async operation has ended');
                infiniteScroll.complete();
            }, 500);
        });
    }
}
