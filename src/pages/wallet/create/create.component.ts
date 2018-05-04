import {
    Component, OnInit, ComponentFactoryResolver, ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import { WalletService, wallet as w, Wallet } from '../../../neo';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { NavController, MenuController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';

/**
 * only once display when created a new wallet
 * display qrcode of new WIF
 * ask to backup
 * ask to set password
 * link to home
 *
 * generate qrcode of wif
 */

@Component({
    selector: 'wallet-create',
    templateUrl: 'create.component.html',
    animations: [
        flyUp, mask
    ]
})
export class WalletCreateComponent implements OnInit {
    public shown: boolean = true;
    public newWallet: Wallet;
    public wif: string;
    public copied: boolean;
    public pwd: string;
    constructor(
        private wallet: WalletService,
        private global: GlobalService,
        private navCtrl: NavController,
        private menu: MenuController,
        private vcRef: ViewContainerRef,
        private input: PopupInputService,
        private loading: LoadingController,
        private navParams: NavParams,
        private alert: AlertController
    ) {
        //
    }

    public ngOnInit() {
        this.menu.swipeEnable(false);
        this.pwd = this.navParams.get('pwd');
        if (!this.pwd) {
            this.global.Alert('UNKNOWN');
            return;
        }
        const load = this.loading.create({content: 'Creating...'});
        load.present();
        this.wallet.Create(this.pwd).subscribe((res: Wallet) => {
            load.dismiss();
            this.newWallet = res;
            this.global.getQRCode('wallet-qrcode', this.newWallet.wif, 160, 'assets/app/logo.png');
        }, (err) => {
            load.dismiss();
            console.log(err);
            this.global.Alert('UNKNOWN');
        });
    }

    public home() {
        this.navCtrl.setRoot(AssetListComponent);
    }

    public copy() {
        this.global.Copy('wif-copy').then((res) => {
            this.copied = true;
        }).catch((err) => {
            this.alert.create({subTitle: 'Sorry that you need to copy manually.'}).present();
        });
    }

    public enter() {
        const ask = this.alert.create({
            title: 'Caution',
            subTitle: 'Sure to enter wallet?\n(Please ensure you have backed up your WIF)',
            buttons: ['Cancel', {
                text: 'Enter',
                role: 'go'
            }]
        });
        ask.present();
        ask.onDidDismiss((data, role) => {
            if (role === 'go') {
                this.wallet.Save(this.newWallet);
                this.navCtrl.setRoot(AssetListComponent);
            }
        });
    }
}
