import { Component, OnInit } from '@angular/core';
import QrCodeWithLogo from 'qr-code-with-logo';
import { Storage} from '@ionic/storage';
import { WalletService } from '../../../neo';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
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
        private input: PopupInputService,
        private alert: AlertController
    ) { }
    public ngOnInit() {
        this.storage.get('wallet').then((res) => {
            this.wif = res.wif;
            this.address = this.wallet.GetAddressFromWIF(res.wif);
            this.getQRCode();
        });
    }
    public  getQRCode() {
        const qrcode = document.getElementById('qrcode');
        QrCodeWithLogo.toImage({
            image: qrcode,
            content: this.address,
            width: 200,
            logo: {
                src: 'assets/asset/qrcode_logo.png',
                radius: 8
            }
        });
        return ;
    }
    public copy() {
        this.global.Copy('wallet-address').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.alert.create({subTitle: 'Sorry that you need to copy manually.'}).present();
        });
    }
}
