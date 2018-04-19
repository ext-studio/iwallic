import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';
import { WalletOpenComponent } from '../open/open.component';
import { WalletHomeComponent } from '../home/home.component';

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
        private wallet: WalletService,
        private global: GlobalService
    ) { }

    public ngOnInit() { }
    public create() {
        this.wallet.Create().subscribe((res) => {
            console.log(`create new wallet(private key):`, res);
            this.navCtrl.push(WalletHomeComponent, {type: 'create', key: res});
        }, (err) => {
            console.log(err);
            this.global.Alert('UNKNOWN');
        });
    }
}
