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
    public wif: string;
    public copied: boolean;
    constructor(
        private storage: Storage,
        private wallet: WalletService,
        private global: GlobalService,
        private alert: AlertController,
    ) { }
    public ngOnInit() {
        this.wallet.Wallet().subscribe((res) => {
            this.wif = res.wif;
            this.address = this.wallet.GetAddressFromWIF(res.wif);
            this.global.getQRCode('qrcode', this.address, 200);
        });
    }
    public copy() {
        this.global.Copy('wallet-address').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.alert.create({subTitle: 'Sorry that you need to copy manually.'}).present();
        });
    }
}
