import { NgModule } from '@angular/core';
import { GlobalService } from './services/global';
import { NetService } from './services/net';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { PopupInputService } from './services/popup-input';
import { ReadFileService } from './services/readfile';
import { TranslateService } from './services/translate';
import { ThemeService } from './services/theme';
import { NavController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { BlockState } from './states/block';
import { BalanceState } from './states/balance';
import { TransactionState } from './states/transaction';
import { PopupInputComponent } from './directives/popup-input/popup-input.component';
import {
    IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
    ISrcDirective, ISrcPipe
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
        ISrcDirective, ISrcPipe
    ],
    declarations: [
        PopupInputComponent,
        IBgDirective, IBorderDirective, IColorDirective, ImgPipe, ThemePipe,
        ISrcDirective, ISrcPipe
    ],
    entryComponents: [PopupInputComponent],
    providers: [
        GlobalService, PopupInputService, ReadFileService, TranslateService,
        BlockState, BalanceState, TransactionState, ThemeService, NetService
    ]
})
export class CoreModule { }
