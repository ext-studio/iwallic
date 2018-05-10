import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, ReadFileService } from '../../../core';
import { WalletService, Wallet } from '../../../neo';
import { PopupInputComponent, flyUp, mask } from '../../../shared';
import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { File } from '@ionic-native/file';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Subscription } from 'rxjs/Subscription';

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
        private file: ReadFileService,
        private load: LoadingController
    ) { }

    public ngOnInit() {
        //
    }

    public enterPwd() {
        this.input.open(this.navCtrl, 'ENTER').subscribe((res) => {
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
        this.input.open(this.navCtrl, 'CONFIRM').subscribe((res) => {
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
        const load = this.load.create({content: 'Verify'});
        this.file.read().switchMap((json) => {
            const w = new Wallet(json);
            if (!w.wif) {
                return this.input.open(this.navCtrl, 'ENTER').switchMap((pwd) => {
                    if (pwd) {
                        load.present();
                        return this.wallet.Verify(pwd, w).map(() => {
                            load.dismiss();
                            return w;
                        }).catch((e) => {
                            load.dismiss();
                            return Observable.throw(e);
                        });
                    } else {
                        return Observable.throw('need_verify');
                    }
                });
            }
            return Observable.of(w);
        }).subscribe((res) => {
            this.wallet.Save(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            if (err === 'verify_failed') {
                this.alert.create({
                    title: 'Caution',
                    subTitle: 'Password is wrong.',
                    buttons: ['OK']
                }).present();
            } else if (err !== 'need_verify') {
                this.alert.create({
                    title: 'Caution',
                    subTitle: 'Import failed, please check your wallet file. (Only support NEP-6 JSON file)',
                    buttons: ['OK']
                }).present();
            }
        });
    }
    public check() {
        return this.pwd && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && this.wallet.CheckWIF(this.wif);
    }
}
