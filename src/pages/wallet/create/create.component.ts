import { Component, OnInit } from '@angular/core';

import { WalletService, Wallet } from '../../../neo';
import { GlobalService } from '../../../core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';

@Component({
    selector: 'wallet-create',
    templateUrl: 'create.component.html'
})
export class WalletCreateComponent implements OnInit {
    public shown: boolean = true;
    public newWallet: Wallet;
    public copied: boolean;
    public pwd: string;
    constructor(
        private wallet: WalletService,
        private global: GlobalService,
        private navCtrl: NavController,
        private menu: MenuController,
        private navParams: NavParams
    ) {
        //
    }

    public ngOnInit() {
        this.pwd = this.navParams.get('pwd');
        if (!this.pwd) {
            this.global.Error(99999).subscribe();
            return;
        }
        this.global.LoadI18N('LOADING_CREATING').subscribe((load) => {
            this.wallet.Create(this.pwd).subscribe((res: Wallet) => {
                load.dismiss();
                this.newWallet = res;
                this.global.GenerateQRCode('wallet-qrcode', this.newWallet.wif, 160, 'assets/app/logo.png');
            }, (err) => {
                load.dismiss();
                this.global.Error(err).subscribe();
            });
        });
    }

    public copy() {
        this.global.Copy(this.newWallet.wif).then((res) => {
            if (res) {
                this.copied = true;
            }
        });
    }

    public enter() {
        this.global.AlertI18N({
            title: 'ALERT_TITLE_CAUTION',
            content: 'ALERT_CONTENT_ENTERWALLET',
            ok: 'ALERT_OK_SURE',
            no: 'ALERT_NO_CANCEL'
        }).subscribe((res) => {
            if (res) {
                this.menu.enable(true, 'iwallic-menu');
                this.wallet.Save(this.newWallet);
                this.navCtrl.setRoot(AssetListComponent);
            }
        });
    }
}
