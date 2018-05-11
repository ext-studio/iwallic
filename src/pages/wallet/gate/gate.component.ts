import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';
import { TransactionService } from '../../../neo';
import { GlobalService, PopupInputService } from '../../../core';

/**
 * wallet gate page
 * 1. user has not open any wallet
 * 2. user click close wallet
 */

@Component({
    selector: 'wallet-gate',
    templateUrl: 'gate.component.html'
})
export class WalletGateComponent implements OnInit, OnDestroy {
    public openPage = WalletOpenComponent;
    public createPage = WalletPwdComponent;
    constructor(
        private navCtrl: NavController,
        private menu: MenuController,
        private global: GlobalService,
        private input: PopupInputService,
        private transaction: TransactionService
    ) { }

    public ngOnInit() {
        //
    }

    public ngOnDestroy() {
        //
    }
}
