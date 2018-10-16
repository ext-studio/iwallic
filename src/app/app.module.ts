import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';


import { CoreModule } from './core';
import { NEOModule } from './neo';

import { AppRoutingModule } from './app.route';
import { AppComponent } from './app.component';

import { WelcomeModule } from './welcome/welcome.module';
import { AssetModule } from './asset/asset.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';



@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),

        CoreModule, NEOModule,

        WelcomeModule, AssetModule, TransactionModule, WalletModule
    ],
    declarations: [AppComponent],
    providers: [SplashScreen, StatusBar],
    bootstrap: [AppComponent]
})
export class AppModule {}
