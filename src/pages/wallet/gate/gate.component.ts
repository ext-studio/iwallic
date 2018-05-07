import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';
import { WalletService, Wallet } from '../../../neo';
import { TestState } from './test.state';

/**
 * wallet gate page
 * 1. user has not open any wallet
 * 2. user click close wallet
 */

@Component({
    selector: 'wallet-gate',
    templateUrl: 'gate.component.html'
})
export class WalletGateComponent implements OnInit {
    public openPage = WalletOpenComponent;
    public createPage = WalletPwdComponent;
    constructor(
        private navCtrl: NavController,
        private menu: MenuController,
        private wallet: WalletService,
        private test: TestState
    ) { }

    public ngOnInit() {
        this.menu.swipeEnable(false);
        this.test.data().subscribe((res) => {
            console.log('from initial', res);
        });
        setTimeout(() => {
            this.test.data().subscribe((res) => {
                console.log('from another', res);
            });
            setTimeout(() => {
                this.test.fetch();
            }, 5000);
        }, 5000);
        this.test.fetch();
    }
}
