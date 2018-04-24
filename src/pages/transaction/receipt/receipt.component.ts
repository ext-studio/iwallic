import { Component, OnInit } from '@angular/core';
// import QrCodeWithLogo from 'qr-code-with-logo';
import { Storage} from '@ionic/storage';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';
import { AlertController, LoadingController } from 'ionic-angular';

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
        private loading: LoadingController,
    ) { }
    public ngOnInit() {
        this.storage.get('wallet').then((res) => {
            this.wif = res.wif;
            this.address = this.wallet.GetAddressFromWIF(res.wif);
            this.global.getQRCode('qrcode', this.address, 200);
        });
        const loader = this.loading.create();
        loader.present();
        this.wallet.Wallet().subscribe(() => {
            loader.dismiss();
            console.log('to do...');
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
