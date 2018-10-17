import { NgModule } from '@angular/core';

import { TranslateModule, TranslateLoader, TranslateService as NgxTranslate } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { GlobalService } from './services/global';
import { TranslateService } from './services/translate';
import { HttpService } from './services/http';
import { DialogService } from './services/dialog';

import { BlockState } from './states/block';
import { BalanceState } from './states/balance';
import { TransactionState } from './states/transaction';

// for i18n
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const translateModuleConfig = {
    loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
    }
};

@NgModule({
    imports: [
        CommonModule, FormsModule,
        IonicStorageModule.forRoot({
            name: '__iwallicdb',
            driverOrder: ['sqlite', 'indexeddb', 'websql']
        }),
        HttpClientModule,
        TranslateModule.forRoot(translateModuleConfig)
    ],
    exports: [
        
    ],
    declarations: [
        
    ],
    entryComponents: [
        
    ],
    providers: [
        GlobalService, TranslateService, DialogService,
        BlockState, BalanceState, TransactionState,
        HTTP, HttpService, Clipboard, Dialogs, QRScanner, AppVersion
    ]
})
export class CoreModule {
    constructor(
        private translate: NgxTranslate
    ) {
        translate.setDefaultLang('en');
        translate.use('en');
    }
}
