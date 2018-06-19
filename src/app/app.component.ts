import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { WalletService } from '../neo';
import {
    AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxTransferComponent
} from '../pages';
import {
    BlockState, BalanceState, TransactionState,
    ConfigService, GlobalService, TranslateService,
    ThemeService
} from '../core';

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
        // private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private global: GlobalService,
        private wallet: WalletService,
        private menu: MenuController,
        private translate: TranslateService,
        private block: BlockState,
        private balance: BalanceState,
        private transaction: TransactionState,
        private config: ConfigService,
        private themeService: ThemeService,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    private initializeApp() {
        this.splashScreen.show();
        this.platform.ready().then(() => {
            this.splashScreen.show();
            this.initStatusbar();
            this.initSwipe();
            this.initConfig();
            this.initBackBtn();
        });
    }

    public pushPage(page: any) {
        if (this.nav.getActive().component === AssetListComponent) {
            this.nav.push(page);
        } else {
            this.nav.pop({ animate: false });
            this.nav.push(page, null, { animate: true });
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
        this.block.listen().subscribe(() => {
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
        this.config.Init().subscribe((res) => {
            console.log(res);
            if (res !== 'offline') {
                this.initListen();
                this.versionCheck();
            }
            this.wallet.Get().subscribe(() => {
                (window as any).isReady = true;
                this.splashScreen.hide();
                this.menu.enable(true, 'iwallic-menu');
                this.nav.setRoot(AssetListComponent);
            }, (err) => {
                console.log(err);
                (window as any).isReady = true;
                this.splashScreen.hide();
                this.menu.enable(false, 'iwallic-menu');
                if (err === 'need_verify') {
                    this.nav.setRoot(WalletVerifyComponent);
                } else {
                    this.nav.setRoot(WalletGateComponent);
                }
            });
        });
    }

    private versionCheck() {
        this.config.version().subscribe((version: any) => {
            if (version.curr !== version.latest) {
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_TIP',
                    content: 'ALERT_CONTENT_NEWVERSION',
                    ok: 'ALERT_OK_UPDATE',
                    no: 'ALERT_NO_CANCEL'
                }).subscribe((confirm) => {
                    if (confirm) {
                        this.global.browser(version.url, 'INAPP');
                    }
                });
            } else {
                console.log('no need');
            }
        }, (err) => console.log(err));
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

    private initStatusbar() {
        if (this.platform.is('android')) {
            this.statusBar.styleLightContent();
            return;
        }
        this.themeService.get().subscribe(val => {
            if (this.platform.is('ios')) {
                if (val === 'dark') {
                    this.statusBar.styleLightContent();
                } else {
                    this.statusBar.styleDefault();
                }
            }
        });
    }
}
