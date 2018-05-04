import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, InputRef } from '../../../core';
import { WalletService } from '../../../neo';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { NavController, MenuController, AlertController } from 'ionic-angular';
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
    public importing: boolean = false;
    constructor(
        private vcRef: ViewContainerRef,
        private navCtrl: NavController,
        private input: PopupInputService,
        private global: GlobalService,
        private wallet: WalletService,
        private alert: AlertController,
        private file: File
    ) { }

    public ngOnInit() {
        //
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
        if (this.importing) {
            return;
        }
        this.importing = true;
        this.wallet.Import(this.wif, this.pwd, 'NEP2').subscribe((res) => {
            this.wallet.Save(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            this.alert.create({title: 'Import failed.'}).present();
        });
    }
    public fromNEP6() {
        this.alert.create({title: 'Completing soon !'}).present();
    }
    public check() {
        return this.pwd && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && this.wallet.CheckWIF(this.wif);
    }
}
