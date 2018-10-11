import { Component, OnInit } from '@angular/core';
import { GlobalService, PopupInputService, ReadFileService, ScannerService } from '../../../core';
import { WalletService, Wallet } from '../../../neo';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

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
        this.wallet.ImportWIF(this.wif, this.pwd).subscribe((res) => {
            this.importing = false;
            this.menu.enable(true, 'iwallic-menu');
            this.wallet.SaveBackup(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            this.global.Error(err).subscribe();
            this.importing = false;
        });
    }
    public fromNEP6() {
        if (this.importing) {
            return;
        }
        let json;
        this.file.read().pipe(switchMap((res) => {
            json = res;
            const w = new Wallet(json);
            if (w.wif) {
                return of(w);
            }
            return this.input.open(this.navCtrl).pipe(switchMap((pwd) => pwd ?
            this.global.LoadI18N('LOADING_VERIFY').pipe(switchMap((load) => {
                return this.wallet.Verify(pwd, w).pipe(map((r) => {
                    load.dismiss();
                    return w;
                }), catchError((e) => {
                    load.dismiss();
                    return Observable.throw(e);
                }));
            })) : Observable.throw(99980)));
        })).subscribe((res) => {
            this.menu.enable(true, 'iwallic-menu');
            this.wallet.SaveBackup(res);
            this.navCtrl.setRoot(AssetListComponent);
        }, (err) => {
            switch (err) {
                case 99994:
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_CAUTION',
                    content: 'ALERT_CONTENT_IMPORTNEP6',
                    ok: 'ALERT_OK_SURE'
                }).subscribe();
                return;
                case 99986:
                this.tryOTCWallet(json);
                return;
                case 99987:
                this.global.Alert('WRONGPWD').subscribe();
                return;
                default:
                this.global.Alert(err).subscribe();
                return;
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

    /**
     * try to import from OTC wallet
     */
    private tryOTCWallet(json: any) {
        const privateKeyEncrypted = json['privateKeyEncrypted'];
        const publicKey = json['publicKeyCompressed'];
        if (!privateKeyEncrypted || !publicKey) {
            this.global.AlertI18N({
                title: 'ALERT_TITLE_CAUTION',
                content: 'ALERT_CONTENT_IMPORTNEP6',
                ok: 'ALERT_OK_SURE'
            }).subscribe();
            return;
        }
        return this.input.open(this.navCtrl).pipe(switchMap((pwd) => pwd ?
        this.global.LoadI18N('LOADING_VERIFY').pipe(switchMap((load) => {
            return this.wallet.verifyNep2(privateKeyEncrypted, publicKey, pwd).pipe(map((res) => {
                load.dismiss();
                return {wif: res, pwd};
            }), catchError((err) => {
                load.dismiss();
                throw err;
            }));
        })) : Observable.throw(99980))).subscribe((res: any) => {
            this.pwd = res.pwd;
            this.rePwd = res.pwd;
            this.wif = res.wif;
            this.import();
        }, (err) => {
            switch (err) {
                case 99987:
                this.global.Alert('WRONGPWD').subscribe();
                return;
                default:
                this.global.Alert(err).subscribe();
                return;
            }
        });
    }
}
