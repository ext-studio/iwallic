import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';

@Component({
    selector: 'wallet-verify',
    templateUrl: 'verify.component.html'
})
export class WalletVerifyComponent implements OnInit {
    public openPage = WalletOpenComponent;
    public createPage = WalletPwdComponent;
    public pwd: string;
    constructor(
        private wallet: WalletService,
        private nav: NavController,
        private global: GlobalService,
        private menu: MenuController
    ) { }

    public ngOnInit() {
        //
    }
    public verify() {
        this.global.LoadI18N('LOADING_VERIFY').subscribe((load) => {
            this.wallet.Get(this.pwd).subscribe((res) => {
                load.dismiss();
                this.menu.enable(true, 'iwallic-menu');
                this.nav.setRoot(AssetListComponent);
            }, (err) => {
                load.dismiss();
                this.global.Error(err).subscribe();
            });
        });
    }
}
