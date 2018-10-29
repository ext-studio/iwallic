import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { Wallet, WalletService } from '../../neo';
import { GlobalService, DialogService } from '../../core';
import { NavController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';


@Component({
    templateUrl: 'backup.component.html',
    styleUrls: ['./backup.component.scss']
})
export class BackupComponent {
    public verified: boolean = false;
    public shown: boolean = false;
    public wallet: Wallet;
    public copied: boolean;
    public wif: string = "";
    constructor(
        private router: Router,
        private location: Location,
        private global: GlobalService,
        private dialog: DialogService,
        private w: WalletService
    ) {
        
    }

    public copy() {
        this.global.Copy(this.wif).then((res) => {
            if (res) {
                this.copied = true;
            }
        });
    }

    public showQRCode() {
        if (this.verified) {
            return;
        }
        this.dialog.password().then((pwd: string) => {
            if (!pwd || !pwd.length) {
                return;
            }
            this.dialog.loader('Verifying...').then((loader) => {
                this.w.verify(pwd).subscribe((wif) => {
                    this.global.GenerateQRCode('wallet-qrcode', wif, 160, 'assets/images/logo.png');
                    this.verified = true;
                    this.shown = true;
                    this.wif = wif;
                    this.dialog.toast('Verified!');
                    loader.dismiss();
                }, (werr) => {
                    loader.dismiss();
                    this.dialog.toast(werr);
                });
            });
        });
    }
    public leaveConfirm() {
        this.dialog.confirm("Have you backed up and sure to leave?", "Notice", "Leave", "Cancel").then((res) => {
            if (res) {
                this.location.back();
            }
        });
    }
}
