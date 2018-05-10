import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, AlertController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { WalletGateComponent } from '../gate/gate.component';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';
import { WalletService, Wallet } from '../../../neo';
import { GlobalService } from '../../../core';

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
        private alert: AlertController,
        private global: GlobalService
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
            this.global.AlertI18N({
                title: 'ALERT_TITLE_CAUTION',
                content: 'ALERT_CONTENT_WALLETVERIFY',
                ok: 'ALERT_OK_SURE'
            }).subscribe();
            console.log(err);
        });
    }
}
