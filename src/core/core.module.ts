import { NgModule } from '@angular/core';
import { GlobalService } from './services/global';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { PopupInputService } from './services/popup-input';
import { ReadFileService } from './services/readfile';
import { TranslateService } from './services/translate';

import { BalanceState } from './states/balance';

@NgModule({
    imports: [
        IonicStorageModule.forRoot({
            name: '__iwallicdb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        HttpClientModule
    ],
    exports: [],
    declarations: [],
    providers: [
        GlobalService, PopupInputService, ReadFileService, TranslateService,
        BalanceState
    ]
})
export class CoreModule {}
