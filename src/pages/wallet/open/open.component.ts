import { Component, OnInit } from '@angular/core';
import { GlobalService, PopupInputService, ReadFileService } from '../../../core';
import { WalletService, Wallet, TransactionService, ASSET } from '../../../neo';
import { NavController, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

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
            this.wallet.SaveBackup(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            this.global.AlertI18N({content: 'ALERT_CONTENT_IMPORTFAILED'}).subscribe();
        });
    }
    public fromNEP6() {
        this.file.read().switchMap((json) => {
            const w = new Wallet(json);
            if (!w.wif) {
                return this.input.open(this.navCtrl, 'ENTER').switchMap((pwd) => {
                    if (pwd) {
                        return this.global.LoadI18N('LOADING_VERIFY').switchMap((load) => {
                            return this.wallet.Verify(pwd, w).map(() => {
                                load.dismiss();
                                return w;
                            }).catch((e) => {
                                load.dismiss();
                                return Observable.throw(e);
                            });
                        });
                    } else {
                        return Observable.throw('need_verify');
                    }
                });
            }
            return Observable.of(w);
        }).subscribe((res) => {
            this.wallet.SaveBackup(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            console.log(err);
            if (err === 'verify_failed') {
                this.global.Alert('WRONGPWD').subscribe();
            } else if (err !== 'need_verify') {
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_CAUTION',
                    content: 'ALERT_CONTENT_IMPORTNEP6',
                    ok: 'ALERT_OK_SURE'
                }).subscribe();
            }
        });
    }
    public check() {
        return this.pwd && this.pwd.length > 5 && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && this.wallet.CheckWIF(this.wif);
    }
}
