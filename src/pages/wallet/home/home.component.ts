import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * if wallet is newly created
 *  ask to confirm when click back
 *  ask to backup wallet
 * if already opened a wallet(did not get params)
 *  show main wallet
 *  show create new button
 *  show close button
 *  show open button
 *  show backup button
 */

@Component({
    templateUrl: 'home.component.html'
})
export class WalletHomeComponent implements OnInit {
    constructor(
        private navParams: NavParams
    ) { }

    public ngOnInit() {
        const type = this.navParams.get('type');
        const key = this.navParams.get('key');
        if (type && key) {
            console.log(`new created wallet`, key);
            return;
        }
        console.log(`try to get wallet from db`);
    }
}
