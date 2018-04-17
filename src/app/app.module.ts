import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';
import { ListPageComponent } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        MyAppComponent,
        HomePageComponent,
        ListPageComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyAppComponent),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyAppComponent,
        HomePageComponent,
        ListPageComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
