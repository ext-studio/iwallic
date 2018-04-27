import { Component, ViewChild } from '@angular/core';
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
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
    ScanAddrComponent
} from '../pages';

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
        private menu: MenuController
    ) {
        this.initializeApp();
    }

    private initializeApp() {
        // this.storage.remove('wallet');
        this.platform.ready().then(() => {
            const loader = this.loading.create();
            loader.present();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.wallet.Wallet().subscribe(() => {
                loader.dismiss();
                this.rootPage = AssetListComponent;
            }, (err) => {
                loader.dismiss();
                if (err === 'not_exist') {
                    this.nav.setRoot(WalletGateComponent);
                }
                console.log(err);
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
            title: 'Caution',
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
                this.wallet.CloseWallet();
                this.menu.close();
                this.nav.setRoot(WalletGateComponent);
            }
        });
    }
}
