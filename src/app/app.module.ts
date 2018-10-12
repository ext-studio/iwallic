import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app.route';
import { AppComponent } from './app.component';

import { MainModule } from './main/main.module';
import { AssetModule } from './asset/asset.module';
import { TransactionModule } from './transaction/transaction.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),

    MainModule, AssetModule, TransactionModule
  ],
  declarations: [AppComponent],
  providers: [SplashScreen, StatusBar],
  bootstrap: [AppComponent]
})
export class AppModule {}
