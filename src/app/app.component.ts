import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from 'ionic-angular';

import { GlobalService } from '../core';
import { mask } from '../shared';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletHomeComponent, WalletOpenComponent, WalletGateComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent
} from '../pages';

@Component({
    templateUrl: 'app.component.html',
    animations: [ mask ]
})
export class AppComponent {
    @ViewChild(Nav) public nav: Nav;
    public pages: Array<{title: string, component: any}>;
    private rootPage: any = AssetListComponent;

    constructor(
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private storage: Storage,
        private alert: AlertController,
        private loading: LoadingController,
        private global: GlobalService
    ) {
        this.initializeApp();
        this.pages = [
            { title: 'AssetList', component: AssetListComponent },
            { title: 'AssetDetail', component: AssetDetailComponent },
            { title: 'AssetAttach', component: AssetAttachComponent },
            { title: 'SystemAbout', component: SystemAboutComponent },
            { title: 'SystemHelper', component: SystemHelperComponent },
            { title: 'SystemSetting', component: SystemSettingComponent },
            { title: 'WalletHome', component: WalletHomeComponent },
            { title: 'WalletOpen', component: WalletOpenComponent },
            { title: 'WalletGate', component: WalletGateComponent },
            { title: 'TxDetail', component: TxDetailComponent },
            { title: 'TxList', component: TxListComponent },
            { title: 'TxReceipt', component: TxReceiptComponent },
            { title: 'TxTransfer', component: TxTransferComponent }
        ];
    }

    private initializeApp() {
        this.platform.ready().then(() => {
            const loader = this.loading.create();
            loader.present();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.global.Wallet().subscribe(() => {
                loader.dismiss();
                console.log('to do...');
            }, (err) => {
                loader.dismiss();
                if (err === 'not_exist') {
                    this.nav.setRoot(WalletGateComponent);
                }
                console.log(err);
            });
        });
    }

    public openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
