import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';

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
    constructor(
        private navCtrl: NavController,
        private menu: MenuController
    ) { }

    public ngOnInit() {
        this.menu.swipeEnable(false);
    }
    public create() {
        this.navCtrl.push(WalletPwdComponent);
    }
}
