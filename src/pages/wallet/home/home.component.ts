import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 *  show main wallet
 *  show create new button
 *  show close button
 *  show open button
 *  show backup button
 *  show reset pwd button
 */

@Component({
    templateUrl: 'home.component.html'
})
export class WalletHomeComponent implements OnInit {
    constructor(
        private navParams: NavParams
    ) { }

    public ngOnInit() {
        //
    }
}
