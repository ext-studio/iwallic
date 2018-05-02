import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { WalletGateComponent } from '../gate/gate.component';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';
import { WalletService, Wallet } from '../../../neo';

@Component({
    selector: 'wallet-verify',
    templateUrl: 'verify.component.html'
})
export class WalletVerifyComponent implements OnInit {
    public openPage = WalletOpenComponent;
    public createPage = WalletPwdComponent;
    public verifying: boolean = false;
    public pwd: string;
    constructor(
        private wallet: WalletService,
        private nav: NavController,
        private alert: AlertController
    ) { }

    public ngOnInit() { }
    public verify() {
        if (this.verifying) {
            return;
        }
        this.verifying = true;
        this.wallet.Get(this.pwd).subscribe((res) => {
            this.verifying = false;
            this.nav.setRoot(AssetListComponent);
        }, (err) => {
            this.verifying = false;
            this.alert.create({title: err}).present();
        });
    }
}
