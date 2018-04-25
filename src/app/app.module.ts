import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { File } from '@ionic-native/file';

import { AppComponent } from './app.component';
import { CoreModule } from '../core';
import { NEOModule } from '../neo';
import { SharedModule } from '../shared';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent, WalletPwdComponent,
    TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent
} from '../pages';
import { TranslateModule, TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Clipboard } from '@ionic-native/clipboard';

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
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent, WalletPwdComponent, // wallet
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent // transaction
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(AppComponent),
        NEOModule, SharedModule,
        CoreModule,
        // for i18n must place after CoreModule
        TranslateModule.forRoot(translateModuleConfig),
        NgxQRCodeModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent,
        AssetAttachComponent, AssetDetailComponent, AssetListComponent,
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
        WalletBackupComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent, WalletPwdComponent,
        TxDetailComponent, TxListComponent, TxReceiptComponent, TxTransferComponent, TxSuccessComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        // Clipboard,
        File,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
    constructor(
        private translate: TranslateService
    ) {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }
}
