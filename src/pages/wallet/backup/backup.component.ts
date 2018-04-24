import { Component, OnInit } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { WalletService } from '../../../neo';
import { NavController, MenuController, NavParams, AlertController } from 'ionic-angular';

/**
 *  also as wallet backup page
 *  show main wallet
 *  show create new button
 *  show close button
 *  show open button
 *  show backup button
 *  show reset pwd button
 */

@Component({
    selector: 'wallet-backup',
    templateUrl: 'backup.component.html'
})
export class WalletBackupComponent implements OnInit {
    public qrcode: boolean = false;
    public wallet: any;
    public copied: boolean;
    public shown: boolean = false;
    constructor(
        private navParams: NavParams,
        private global: GlobalService,
        private alert: AlertController,
        private w: WalletService
    ) { }

    public ngOnInit() {
        this.w.Wallet().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Alert('UNKNOWN');
        });
    }

    public copy() {
        this.global.Copy('wif-copy').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.alert.create({subTitle: 'Sorry that you need to copy manually.'}).present();
        });
    }

    public showQRCode() {
        if (this.qrcode || !this.wallet) {
            return;
        }
        this.global.getQRCode('wallet-qrcode', this.wallet.wif, 160, 'assets/app/logo.png');
        this.qrcode = true;
    }
}
