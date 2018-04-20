import {
    Component, OnInit, ComponentFactoryResolver, ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import { WalletService, wallet as w } from '../../../neo';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { PopupInputComponent } from '../../../shared';
import { NavController, MenuController } from 'ionic-angular';
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
    encapsulation: ViewEncapsulation.Emulated
})
export class WalletCreateComponent implements OnInit {
    public wif: string = '';
    constructor(
        private wallet: WalletService,
        private global: GlobalService,
        private navCtrl: NavController,
        private menu: MenuController,
        private vcRef: ViewContainerRef,
        private input: PopupInputService
    ) { }

    public ngOnInit() {
        this.menu.swipeEnable(false);
        this.wallet.Create().subscribe((res) => {
            this.wif = res;
            console.log(`generate wif from private key`);
            console.log(`generate wif qrcode`);
            console.log(`popup password set plane`);
            console.log(`popup password confirm plane`);
        }, (err) => {
            console.log(err);
            this.global.Alert('UNKNOWN');
        });
    }

    public home() {
        this.navCtrl.setRoot(AssetListComponent);
    }

    public pwd() {
        this.input.open(this.vcRef).afterClose().subscribe((res) => {
            console.log(res);
        });
    }
}
