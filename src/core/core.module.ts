import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

import { GlobalService } from './services/global';
import { PopupInputService } from './services/popup-input';
import { ScannerService } from './services/scanner';
import { ReadFileService } from './services/readfile';
import { TranslateService } from './services/translate';
import { ThemeService } from './services/theme';
import { HttpService } from './services/http';
import { ConfigService } from './services/config';
import { HttpInterceptor } from './services/intercepter';

import { BlockState } from './states/block';
import { BalanceState } from './states/balance';
import { TransactionState } from './states/transaction';

import { PopupInputComponent } from './directives/popup-input/popup-input.component';
import { ScanComponent } from './directives/scan/scan.component';
import { PagerComponent } from './directives/pager/pager.component';
import {
    IBgDirective, IBorderDirective, IColorDirective,
    ImgPipe, ThemePipe, ISrcDirective, ISrcPipe
} from './directives/skin';

@NgModule({
    imports: [
        CommonModule, FormsModule,
        IonicModule,
        IonicStorageModule.forRoot({
            name: '__iwallicdb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        HttpClientModule,
        TranslateModule.forChild()
    ],
    exports: [
        IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
        ISrcDirective, ISrcPipe, PagerComponent
    ],
    declarations: [
        PopupInputComponent, ScanComponent, PagerComponent,
        IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
        ISrcDirective, ISrcPipe
    ],
    entryComponents: [PopupInputComponent, ScanComponent],
    providers: [
        GlobalService, PopupInputService, ScannerService,
        ReadFileService, TranslateService,
        BlockState, BalanceState, TransactionState,
        ThemeService, ConfigService,
        HTTP, HttpService, {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptor,
            multi: true
        }
    ]
})
export class CoreModule { }
