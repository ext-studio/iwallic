import { Component, OnInit } from '@angular/core';
import { Storage} from '@ionic/storage';
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
        private storage: Storage,
        private wallet: WalletService,
        private global: GlobalService,
        private alert: AlertController,
    ) { }
    public ngOnInit() {
        this.wallet.Get().subscribe((res) => {
            this.address = res.account.address;
            this.global.getQRCode('qrcode', this.address, 200);
        });
    }
    public copy() {
        this.global.Copy('wallet-address').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.global.AlertI18N({content: 'ALERT_CONTENT_COPYMANUALLY'}).subscribe();
        });
    }
}
