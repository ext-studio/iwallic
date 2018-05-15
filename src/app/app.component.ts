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
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
    ScanAddrComponent
} from '../pages';
import { PopupInputService, BlockState, BalanceState, TransactionState } from '../core';

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
    private rootPage: any;
    private leaving: boolean = false;
    private selectedTheme: String;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private storage: Storage,
        private alert: AlertController,
        private loading: LoadingController,
        private global: GlobalService,
        private wallet: WalletService,
        private menu: MenuController,
        private input: PopupInputService,
        private vcRef: ViewContainerRef,
        private config: Config,
        private translate: TranslateService,
        private toast: ToastController,
        private app: IonicApp,
        private block: BlockState,
        private balance: BalanceState,
        private transaction: TransactionState,
        private themeService: ThemeService
    ) {
        this.initializeApp();
        this.themeService.getActiveTheme().subscribe(val => this.selectedTheme = val);
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            const loader = this.loading.create();
            loader.present();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.translate.Init();
            this.wallet.Get().subscribe(() => {
                loader.dismiss();
                this.nav.setRoot(AssetListComponent);
            }, (err) => {
                loader.dismiss();
                console.log(err);
                if (err === 'need_verify') {
                    this.nav.setRoot(WalletVerifyComponent);
                } else {
                    this.nav.setRoot(WalletGateComponent);
                }
            });

            this.block.listen().subscribe((res) => {
                const curr = this.nav.getActive();
                if (!curr) {
                    return;
                }
                switch (curr.name) {
                    case 'AssetListComponent':
                    this.balance.fetchSilent();
                    break;
                    case 'TxListComponent':
                    this.transaction.fetchSilent();
                    break;
                }
            });

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
        });
    }

    public pushPage(page: any) {
        if (this.nav.getActive().name === 'AssetListComponent') {
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
                this.wallet.Close();
                this.menu.close();
                this.nav.setRoot(WalletGateComponent);
                this.balance.clear();
            }
        });
    }
}
