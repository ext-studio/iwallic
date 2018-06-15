import { NgModule } from '@angular/core';
import { GlobalService } from './services/global';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { PopupInputService } from './services/popup-input';
import { ScannerService } from './services/scanner';
import { ReadFileService } from './services/readfile';
import { TranslateService } from './services/translate';
import { ThemeService } from './services/theme';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { BlockState } from './states/block';
import { BalanceState } from './states/balance';
import { TransactionState } from './states/transaction';
import { PopupInputComponent } from './directives/popup-input/popup-input.component';
import { ScanComponent } from './directives/scan/scan.component';
import {
    IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
    ISrcDirective, ISrcPipe
} from './directives/skin';
import { ConfigService } from './services/config';
import { HttpInterceptor } from './services/intercepter';

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
        ISrcDirective, ISrcPipe
    ],
    declarations: [
        PopupInputComponent, ScanComponent,
        IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
        ISrcDirective, ISrcPipe
    ],
    entryComponents: [PopupInputComponent, ScanComponent],
    providers: [
        GlobalService, PopupInputService, ScannerService,
        ReadFileService, TranslateService,
        BlockState, BalanceState, TransactionState,
        ThemeService, ConfigService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptor,
            multi: true
        }
    ]
})
export class CoreModule { }
