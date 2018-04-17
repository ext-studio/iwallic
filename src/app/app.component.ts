import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletHomeComponent, WalletOpenComponent,
    TxDetailComponent, TxListComponent
} from '../pages';

@Component({
    templateUrl: 'app.component.html'
})
export class MyAppComponent {
    @ViewChild(Nav) public nav: Nav;

    public rootPage: any = AssetListComponent;

    public pages: Array<{title: string, component: any}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'AssetList', component: AssetListComponent },
            { title: 'AssetDetail', component: AssetDetailComponent },
            { title: 'AssetAttach', component: AssetAttachComponent },
            { title: 'SystemAbout', component: SystemAboutComponent },
            { title: 'SystemHelper', component: SystemHelperComponent },
            { title: 'SystemSetting', component: SystemSettingComponent },
            { title: 'WalletHome', component: WalletHomeComponent },
            { title: 'WalletOpen', component: WalletOpenComponent },
            { title: 'TxDetail', component: TxDetailComponent },
            { title: 'TxList', component: TxListComponent }
        ];

    }

    public initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    public openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
