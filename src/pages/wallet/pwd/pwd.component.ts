import { Component, OnInit } from '@angular/core';
import { WalletCreateComponent } from '../create/create.component';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'wallet-pwd',
    templateUrl: 'pwd.component.html'
})
export class WalletPwdComponent implements OnInit {
    public pwd: string;
    public rePwd: string;
    constructor(
        private navCtrl: NavController
    ) { }

    public ngOnInit() {
        //
    }
    public create() {
        if (!this.check()) {
            return;
        }
        this.navCtrl.setRoot(WalletCreateComponent, {pwd: this.pwd});
    }
    public check() {
        return this.pwd && this.pwd.length > 5 && this.pwd === this.rePwd;
    }
}
