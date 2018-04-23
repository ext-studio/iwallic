import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { NavController, MenuController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';

/**
 * currently only support wif wallet
 * the coming version will be compatible to a NEP-6 json wallet
 */

@Component({
    selector: 'wallet-open',
    templateUrl: 'open.component.html'
})
export class WalletOpenComponent implements OnInit {
    public wif: string;
    public pwd: string;
    public rePwd: string;
    constructor(
        private vcRef: ViewContainerRef,
        private navCtrl: NavController,
        private input: PopupInputService,
        private global: GlobalService
    ) { }

    public ngOnInit() { }
    public enterPwd() {
        this.input.open(this.vcRef, 'ENTER').afterClose().subscribe((res) => {
            if (res) {
                this.pwd = res;
                this.rePwd = '';
                this.enterRePwd();
            } else {
                this.pwd = '';
                this.rePwd = '';
            }
        });
    }
    public enterRePwd() {
        if (!this.pwd || !this.pwd.length) {
            return;
        }
        this.input.open(this.vcRef, 'CONFIRM').afterClose().subscribe((res) => {
            if (res) {
                this.rePwd = res;
            } else {
                this.rePwd = '';
            }
        });
    }
    public import() {
        if (!this.check()) {
            return;
        }
        this.global.SetWallet(this.wif, this.pwd).then(() => {
            this.navCtrl.setRoot(AssetListComponent);
        }).catch(() => {
            this.global.Alert('UNKNOWN');
        });
    }
    public check() {
        return this.pwd && this.pwd.length === 6 && this.pwd === this.rePwd;
    }
}
