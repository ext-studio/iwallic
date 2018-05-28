import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { QRScanner } from '@ionic-native/qr-scanner';
import { AppComponent } from './app.component';
import { CoreModule } from '../core';
import { NEOModule } from '../neo';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
    WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
    ScanComponent
} from '../pages';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { Clipboard } from '@ionic-native/clipboard';

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
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, // system
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
        WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent, // transaction
        ScanComponent
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
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent,
        WalletCreateComponent, WalletPwdComponent, WalletVerifyComponent,
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent,
        ScanComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        QRScanner,
        File,
        ThemeableBrowser,
        Clipboard,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule { }
