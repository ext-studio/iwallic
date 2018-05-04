import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { WalletService, Wallet } from '../../../neo';
import { NavController, MenuController, NavParams, AlertController, Navbar, LoadingController } from 'ionic-angular';

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
    @ViewChild(Navbar) public navBar: Navbar;
    public verified: boolean = false;
    public shown: boolean = false;
    public wallet: Wallet;
    public copied: boolean;
    constructor(
        private navParams: NavParams,
        private global: GlobalService,
        private alert: AlertController,
        private w: WalletService,
        private input: PopupInputService,
        private vcRef: ViewContainerRef,
        private nav: NavController,
        private load: LoadingController
    ) { }

    public ngOnInit() {
        this.w.Get().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Alert('UNKNOWN');
        });
        this.navBar.backButtonClick = () => {
            if (this.verified) {
                this.leaveConfirm();
            } else {
                this.nav.pop();
            }
        };
    }

    public copy() {
        this.global.Copy('wif-copy').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.alert.create({subTitle: 'Sorry that you need to copy manually.'}).present();
        });
    }

    public showQRCode() {
        if (this.verified) {
            return;
        }
        const check = this.input.open(this.vcRef, 'ENTER');
        check.afterClose().subscribe((res) => {
            if (!res) {
                return;
            }
            const load = this.load.create({content: 'Verifying'});
            load.present();
            this.wallet.Verify(res).subscribe((wres) => {
                this.global.getQRCode('wallet-qrcode', this.wallet.wif, 160, 'assets/app/logo.png');
                this.verified = true;
                this.shown = true;
                load.dismiss();
            }, (werr) => {
                load.dismiss();
                this.global.Alert(werr === 'verify_failed' ? 'WRONGPWD' : 'UNKNOWN');
            });
        });
    }

    public leaveConfirm() {
        const alert = this.alert.create({
            title: 'Tip',
            subTitle: 'Have you backed up and sure to leave?',
            buttons: [
                'Cancel',
                {
                    text: 'Leave now',
                    role: 'ok'
                }
            ]
        });
        alert.present();
        alert.onDidDismiss((data, role) => {
            if (role === 'ok') {
                this.w.Backup();
                this.nav.pop();
            }
        });
    }
}
