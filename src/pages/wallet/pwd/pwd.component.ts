import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { WalletCreateComponent } from '../create/create.component';
import { NavController, MenuController } from 'ionic-angular';

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
        private input: PopupInputService
    ) { }

    public ngOnInit() { }
    public enterPwd() {
        this.input.open(this.vcRef, 'ENTER').afterClose().subscribe((res) => {
            if (res) {
                this.pwd = res;
                this.rePwd = '';
                this.enterRePwd();
            }
        });
    }
    public enterRePwd() {
        this.input.open(this.vcRef, 'CONFIRM').afterClose().subscribe((res) => {
            if (res) {
                this.rePwd = res;
            }
        });
    }
    public create() {
        if (!this.check()) {
            return;
        }
        this.navCtrl.setRoot(WalletCreateComponent, {pwd: this.pwd});
    }
    public check() {
        return this.pwd && this.pwd.length === 6 && this.pwd === this.rePwd;
    }
}
