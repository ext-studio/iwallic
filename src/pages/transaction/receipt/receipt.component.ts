import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'transaction-receipt',
    templateUrl: 'receipt.component.html',
})
export class TxReceiptComponent implements OnInit {
    public address: string;
    public copied: boolean;
    constructor(
        private wallet: WalletService,
        private global: GlobalService,
        private alert: AlertController,
    ) { }
    public ngOnInit() {
        this.wallet.Get().subscribe((res) => {
            this.address = res.account.address;
            this.global.GenerateQRCode('qrcode', this.address, 200);
        });
    }
    public copy() {
        this.global.Copy(this.address).then((res) => {
            if (res) {
                this.copied = true;
            }
        });
    }
}
