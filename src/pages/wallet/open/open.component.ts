import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { GlobalService, PopupInputService, ReadFileService } from '../../../core';
import { WalletService, Wallet, TransactionService, ASSET } from '../../../neo';
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
        private load: LoadingController,
        private transaction: TransactionService
    ) { }

    public ngOnInit() {
        this.transaction.Send(
            'ARL6itN8Cp9FvTMc58sbbWTXCCgSMMaSoz',
            'AYhN4WsU147R4fjchqGtdBA33DBJQhd4qo',
            1,
            'L25ryXBTMewXXYffgszTomgn4qmsgLgDHQnerhSZ7sStdLN8JBSZ',
            ASSET.NEO,
            false
        ).subscribe((res) => {
            console.log(res);
        });
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
            this.global.AlertI18N({content: 'ALERT_CONTENT_IMPORTFAILED'}).subscribe();
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
        return this.pwd && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && this.wallet.CheckWIF(this.wif);
    }
}
