import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyAppComponent } from './app.component';
import { CoreModule } from '../core';
import { SharedModule } from '../shared';
import {
    AssetAttachComponent, AssetDetailComponent, AssetListComponent,
    SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
    WalletHomeComponent, WalletOpenComponent,
    TxDetailComponent, TxListComponent
} from '../pages';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        MyAppComponent,
        AssetAttachComponent, AssetDetailComponent, AssetListComponent,
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
        WalletHomeComponent, WalletOpenComponent,
        TxDetailComponent, TxListComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyAppComponent),
        CoreModule, SharedModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyAppComponent,
        AssetAttachComponent, AssetDetailComponent, AssetListComponent,
        SystemAboutComponent, SystemHelperComponent, SystemSettingComponent,
        WalletHomeComponent, WalletOpenComponent,
        TxDetailComponent, TxListComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
