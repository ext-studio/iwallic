import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../neo';
import { NavController, MenuController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';

/**
 * currently only support wif wallet
 * the coming version will be compatible to a NEP-6 json wallet
 */

@Component({
    templateUrl: 'open.component.html'
})
export class WalletOpenComponent implements OnInit {
    constructor(
        private wallet: WalletService,
        private navCtrl: NavController,
        private menu: MenuController
    ) { }

    public ngOnInit() {
        console.log(`enter a wif key`);
        console.log(`ask to set password`);
        console.log(`ask to confirm password`);
    }

    public home() {
        this.navCtrl.setRoot(AssetListComponent);
    }
}
