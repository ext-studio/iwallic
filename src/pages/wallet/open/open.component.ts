import { Component, OnInit } from '@angular/core';
import { GlobalService, PopupInputService, ReadFileService, ScannerService } from '../../../core';
import { WalletService, Wallet, ASSET } from '../../../neo';
import { NavController, MenuController, Platform } from 'ionic-angular';
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
    public isScan: boolean = true;
    constructor(
        private navCtrl: NavController,
        private input: PopupInputService,
        private global: GlobalService,
        private wallet: WalletService,
        private menu: MenuController,
        private scanner: ScannerService,
        private file: ReadFileService,
        private platform: Platform
    ) { }

    public ngOnInit() {
        if (this.platform.is('mobileweb') || this.platform.is('core')) {
            this.isScan = false;
        }
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
            this.importing = false;
            this.menu.enable(true, 'iwallic-menu');
            this.wallet.SaveBackup(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            this.global.AlertI18N({content: 'ALERT_CONTENT_IMPORTFAILED'}).subscribe();
            this.importing = false;
        });
    }
    public fromNEP6() {
        if (this.importing) {
            return;
        }
        this.file.read().switchMap((json) => {
            const w = new Wallet(json);
            if (!w.wif) {
                return this.input.open(this.navCtrl).switchMap((pwd) => {
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
            this.menu.enable(true, 'iwallic-menu');
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

    public qrScan() {
        this.scanner.open(this.navCtrl, 'WIF').subscribe((wif) => {
            if (wif) {
                this.wif = wif;
            }
        });
    }
}
