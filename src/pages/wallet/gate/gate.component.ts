import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { WalletOpenComponent } from '../open/open.component';
import { WalletHomeComponent } from '../home/home.component';
import { WalletCreateComponent } from '../create/create.component';

/**
 * wallet gate page
 * 1. user has not open any wallet
 * 2. user click close wallet
 */

@Component({
    templateUrl: 'gate.component.html'
})
export class WalletGateComponent implements OnInit {
    public openPage = WalletOpenComponent;
    public homePage = WalletHomeComponent;
    constructor(
        private navCtrl: NavController,
        private menu: MenuController
    ) { }

    public ngOnInit() {
        this.menu.swipeEnable(false);
    }
    public create() {
        this.navCtrl.setRoot(WalletCreateComponent);
    }
}
