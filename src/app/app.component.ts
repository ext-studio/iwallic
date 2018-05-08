import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, MenuController, NavController, Config } from 'ionic-angular';

import { GlobalService } from '../core';
import { WalletService } from '../neo';
import { TranslateService } from '@ngx-translate/core';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
    ScanAddrComponent
} from '../pages';
import { PopupInputService } from '../core';

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
        private translate: TranslateService
    ) {
        this.initializeApp();
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            const loader = this.loading.create();
            loader.present();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            setTimeout(() => {
                this.translate.get('NAV_BACK').subscribe((res) => {
                    this.config.set('backButtonText', res);
                });
            }, 200);

            document.addEventListener('backbutton', () => {
                if (!this.nav.canGoBack()) {
                    const la = this.alert.create({
                        title: 'Caution',
                        subTitle: 'Sure to leave iWallic?',
                        buttons: [
                            'Cancel',
                            {
                                text: 'Sure',
                                role: 'ok'
                            }
                        ]
                    });
                    la.present();
                    la.onDidDismiss((data, role) => {
                        if (role === 'ok') {
                            this.platform.exitApp();
                        }
                    });
                    return;
                }
                this.nav.pop();
            }, false);

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
        const alert = this.alert.create({
            title: 'Warning',
            subTitle: 'Are you sure to close your wallet ?',
            buttons: [
                'Cancel',
                {
                    text: 'Sign out',
                    role: 'go'
                }
            ]
        });
        alert.present();
        alert.onDidDismiss((data, role) => {
            if (role === 'go') {
                this.wallet.Close();
                this.menu.close();
                this.nav.setRoot(WalletGateComponent);
            }
        });
    }
}
