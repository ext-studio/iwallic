import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, MenuController } from 'ionic-angular';

import { GlobalService } from '../core';
import { WalletService } from '../neo';
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
        private vcRef: ViewContainerRef
    ) {
        this.initializeApp();
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            const loader = this.loading.create();
            loader.present();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.wallet.Check().subscribe(() => {
                loader.dismiss();
                this.nav.setRoot(WalletVerifyComponent);
            }, (err) => {
                loader.dismiss();
                this.nav.setRoot(WalletGateComponent);
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
