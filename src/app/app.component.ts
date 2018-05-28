import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, MenuController, NavController, Config, IonicApp } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { GlobalService, TranslateService, ThemeService } from '../core';
import { WalletService } from '../neo';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletPwdComponent, WalletCreateComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
    ScanAddrComponent
} from '../pages';
import { PopupInputService, BlockState, BalanceState, TransactionState, NetService } from '../core';

@Component({
    templateUrl: 'app.component.html'
})
export class AppComponent {
    @ViewChild(Nav) public nav: Nav;
    public BackupPage = WalletBackupComponent;
    public ImportPage = WalletOpenComponent;
    public TransactionPage = TxListComponent;
    public SettingPage = SystemSettingComponent;
    public HelperPage = SystemHelperComponent;
    public AboutPage = SystemAboutComponent;
    private leaving: boolean = false;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private global: GlobalService,
        private wallet: WalletService,
        private menu: MenuController,
        private translate: TranslateService,
        private block: BlockState,
        private balance: BalanceState,
        private transaction: TransactionState,
        private net: NetService
    ) {
        this.initializeApp();
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            this.initSwipe();
            this.statusBar.styleLightContent();
            this.initConfig();
            this.initBackBtn();
            this.initListen();
            this.splashScreen.hide();
        });
    }

    public pushPage(page: any) {
        if (this.nav.getActive().component === AssetListComponent) {
            this.nav.push(page);
        } else {
            this.nav.pop({animate: false});
            this.nav.push(page, null, {animate: true});
        }
        this.menu.close();
    }

    public signOut() {
        this.global.AlertI18N({
            title: 'ALERT_TITLE_WARN',
            content: 'ALERT_CONTENT_SIGNOUT',
            ok: 'ALERT_OK_SURE',
            no: 'ALERT_NO_CANCEL'
        }).subscribe((res) => {
            if (res) {
                this.menu.enable(false, 'iwallic-menu');
                this.wallet.Close();
                this.menu.close();
                this.nav.setRoot(WalletGateComponent);
                this.balance.clear();
                this.transaction.clear();
            }
        });
    }

    private initListen() {
        this.block.listen().subscribe((res) => {
            const curr = this.nav.getActive();
            if (!curr) {
                return;
            }
            switch (curr.component) {
                // case TxReceiptComponent:
                // case TxSuccessComponent:
                // case AssetAttachComponent:
                case SystemSettingComponent:
                case TxListComponent:
                case AssetDetailComponent:
                this.transaction.fetchSilent();
                // tslint:disable-next-line:no-switch-case-fall-through
                case TxDetailComponent:
                case TxTransferComponent:
                case AssetListComponent:
                this.balance.fetchSilent();
                break;
            }
        });
    }

    private initBackBtn() {
        this.platform.registerBackButtonAction(() => {
            if (this.global.masks.length) {
                //
            } else if (this.global.popups.length) {
                const popup = this.global.popups.pop();
                if (popup && popup.dismiss) {
                    popup.dismiss();
                }
            } else if (this.menu.isOpen()) {
                this.menu.close();
            } else if (this.nav.canGoBack()) {
                this.nav.pop();
            } else if (this.leaving) {
                this.platform.exitApp();
            } else {
                this.leaving = true;
                this.global.ToastI18N('TOAST_EXISTAPP').subscribe((res) => {
                    this.leaving = false;
                });
            }
        });
    }

    private initConfig() {
        this.translate.Init();
        this.net.Init().switchMap(() => this.wallet.Get()).subscribe(() => {
            this.menu.enable(true, 'iwallic-menu');
            this.nav.setRoot(AssetListComponent);
        }, (err) => {
            console.log(err);
            this.menu.enable(false, 'iwallic-menu');
            if (err === 'need_verify') {
                this.nav.setRoot(WalletVerifyComponent);
            } else {
                this.nav.setRoot(WalletGateComponent);
            }
        });
    }

    private initSwipe() {
        if (this.platform.is('ios')) {
            this.nav.swipeBackEnabled = true;
            this.menu.swipeEnable(false, 'iwallic-menu');
        } else {
            this.nav.swipeBackEnabled = false;
            this.menu.swipeEnable(true, 'iwallic-menu');
        }
    }
}
