import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WalletService } from '../neo';
import {
    AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, SystemNotifyComponent,
    WalletBackupComponent, WalletGateComponent,
    TxDetailComponent, TxListComponent, TxTransferComponent
} from '../pages';
import {
    BlockState, BalanceState, TransactionState,
    GlobalService, TranslateService
} from '../core';

@Component({
    templateUrl: 'app.component.html'
})
export class AppComponent {
    @ViewChild(Nav) public nav: Nav;
    private leaving: boolean = false;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private global: GlobalService,
        private wallet: WalletService,
        private menu: MenuController,
        private block: BlockState,
        private balance: BalanceState,
        private transaction: TransactionState,
        private translate: TranslateService
    ) {
        this.splashScreen.show();
        this.platform.ready().then(() => {
            this.initBackBtn();
            this.initSwipe();
            this.initListen();
            this.menu.enable(false, 'iwallic-menu');
            this.translate.Init().subscribe(() => {
                (window as any).isReady = true;
                this.nav.setRoot(SystemNotifyComponent);
                this.splashScreen.hide();
            });
        });
    }

    public pushPage(page: any) {
        let toPage;
        switch (page) {
            case 'wallet-backup':
            toPage = WalletBackupComponent;
            break;
            case 'tx-list':
            toPage = TxListComponent;
            break;
            case 'system-setting':
            toPage = SystemSettingComponent;
            break;
            case 'system-helper':
            toPage = SystemHelperComponent;
            break;
            case 'system-about':
            toPage = SystemAboutComponent;
            break;
            default:
            return;
        }
        if (this.nav.getActive().component === AssetListComponent) {
            this.nav.push(toPage);
        } else {
            this.nav.pop({ animate: false });
            this.nav.push(toPage, null, { animate: true });
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
