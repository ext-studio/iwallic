import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { WalletCreateComponent } from '../create/create.component';
import { NavController, MenuController, LoadingController } from 'ionic-angular';

@Component({
    selector: 'wallet-pwd',
    templateUrl: 'pwd.component.html'
})
export class WalletPwdComponent implements OnInit {
    public pwd;
    public rePwd;
    constructor(
        private vcRef: ViewContainerRef,
        private navCtrl: NavController,
        private input: PopupInputService,
        private load: LoadingController
    ) { }

    public ngOnInit() { }
    public create() {
        if (!this.check()) {
            return;
        }
        this.navCtrl.setRoot(WalletCreateComponent, {pwd: this.pwd});
    }
    public check() {
        return this.pwd && this.pwd === this.rePwd;
    }
}
