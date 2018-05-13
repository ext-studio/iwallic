import { Component, OnInit } from '@angular/core';
import { WalletOpenComponent } from '../open/open.component';
import { WalletPwdComponent } from '../pwd/pwd.component';

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
    constructor() { }

    public ngOnInit() {
        //
    }
}
