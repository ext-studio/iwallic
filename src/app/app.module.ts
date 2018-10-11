import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';

import { AppComponent } from './app.component';
import { CoreModule } from '../core';
import { NEOModule } from '../neo';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, SystemNotifyComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
    WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent
} from '../pages';

// for i18n
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const translateModuleConfig = {
    loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
    }
};

@NgModule({
    declarations: [
        AppComponent, // root
        AssetAttachComponent, AssetDetailComponent, AssetListComponent, // asset
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, SystemNotifyComponent, // system
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
        WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent, // transaction
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(AppComponent, {backButtonText: ''}),
        NEOModule,
        CoreModule,
        TranslateModule.forRoot(translateModuleConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent,
        AssetAttachComponent, AssetDetailComponent, AssetListComponent,
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, SystemNotifyComponent,
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
        WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent
    ],
    providers: [
        StatusBar, SplashScreen,
        Camera, QRScanner, File,
        ThemeableBrowser, Clipboard, AppVersion, InAppBrowser,
        Network,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule { }
