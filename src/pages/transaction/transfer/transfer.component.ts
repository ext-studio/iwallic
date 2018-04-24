import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'transaction-transfer',
    templateUrl: 'transfer.component.html',
})
export class TxTransferComponent implements OnInit {
    public balance: number;
    public isfocus: boolean = false;
    constructor() { }

    public ngOnInit() {
        this.balance = 0;
    }

    public focusNum() {
        this.isfocus = true;
    }
    public blurNum() {
        this.isfocus = false;
    }
}
