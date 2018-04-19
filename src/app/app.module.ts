import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { AppComponent } from './app.component';
import { CoreModule, translateModuleConfig } from '../core';
import { NEOModule } from '../neo';
import { SharedModule } from '../shared';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletHomeComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent,
    TxDetailComponent, TxListComponent
} from '../pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        AppComponent, // root
        AssetAttachComponent, AssetDetailComponent, AssetListComponent, // asset
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent, // system
        WalletHomeComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent, // wallet
        TxDetailComponent, TxListComponent // transaction
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
        WalletHomeComponent, WalletOpenComponent, WalletGateComponent, WalletCreateComponent,
        TxDetailComponent, TxListComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
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
