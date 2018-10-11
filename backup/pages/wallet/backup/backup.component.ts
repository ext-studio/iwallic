import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService, PopupInputService } from '../../../core';
import { WalletService, Wallet } from '../../../neo';
import { NavController, Navbar } from 'ionic-angular';

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
        private global: GlobalService,
        private w: WalletService,
        private input: PopupInputService,
        private nav: NavController
    ) { }

    public ngOnInit() {
        this.w.Get().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Error(err).subscribe();
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
        this.global.Copy(this.wallet.wif).then((res) => {
            if (res) {
                this.copied = true;
            }
        });
    }

    public showQRCode() {
        if (this.verified) {
            return;
        }
        this.input.open(this.nav).subscribe((res) => {
            if (!res) {
                return;
            }
            this.global.LoadI18N('LOADING_VERIFY').subscribe((load) => {
                this.w.Verify(res, null, true).subscribe((wres) => {
                    this.global.GenerateQRCode('wallet-qrcode', this.wallet.wif, 160, 'assets/app/logo.png');
                    this.verified = true;
                    this.shown = true;
                    load.dismiss();
                }, (werr) => {
                    load.dismiss();
                    if (werr === 99987) {
                        this.global.Alert('WRONGPWD').subscribe();
                    } else {
                        this.global.Error(werr).subscribe();
                    }
                });
            });
        });
    }

    public leaveConfirm() {
        this.global.AlertI18N({
            title: 'ALERT_TITLE_TIP',
            content: 'ALERT_CONTENT_BACKUP',
            ok: 'ALERT_OK_SURE',
            no: 'ALERT_NO_CANCEL'
        }).subscribe((res) => {
            if (res) {
                this.w.Backup();
                this.nav.pop();
            }
        });
    }
}
