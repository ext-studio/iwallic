import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { WalletService } from '../../../neo';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { NavController, MenuController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { File } from '@ionic-native/file';

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
        private global: GlobalService,
        private wallet: WalletService,
        private file: File
    ) { }

    public ngOnInit() {
        // KyeUiHRapr63RnyS86N8smh3ijquzyUK8wxEo9NPNmof5CJywXTx
        // this.file.
    }
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
        if (!this.pwd || !this.pwd.length) {
            return;
        }
        this.input.open(this.vcRef, 'CONFIRM').afterClose().subscribe((res) => {
            if (res) {
                this.rePwd = res;
            }
        });
    }
    public import() {
        if (!this.check() || !this.checkWIF()) {
            return;
        }
        this.wallet.SetWallet(this.wif, this.pwd).then(() => {
            this.navCtrl.setRoot(AssetListComponent);
        }).catch(() => {
            this.global.Alert('UNKNOWN');
        });
    }
    public check() {
        return this.pwd && this.pwd.length === 6 && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && this.wallet.CheckWIF(this.wif);
    }
}
