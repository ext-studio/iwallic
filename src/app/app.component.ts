import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, MenuController, NavController, Config } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { GlobalService, Translate } from '../core';
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
import { Observable } from 'rxjs/observable';

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
        private translate: Translate,
        private toast: ToastController
    ) {
        this.initializeApp();
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

            this.platform.registerBackButtonAction(() => {
                if (this.menu.isOpen()) {
                    this.menu.close();
                } else if (this.nav.canGoBack()) {
                    this.nav.pop();
                } else if (this.leaving) {
                    this.platform.exitApp();
                } else {
                    this.leaving = true;
                    const check = this.toast.create({message: 'Touch again to exit.', duration: 2000});
                    check.present();
                    check.onDidDismiss(() => {
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
