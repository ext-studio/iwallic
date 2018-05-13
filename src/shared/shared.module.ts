import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupInputComponent } from './components/popup-input/popup-input.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule, FormsModule, IonicModule,
        TranslateModule.forChild()
    ],
    exports: [
        CommonModule, FormsModule, PopupInputComponent
    ],
    declarations: [
        PopupInputComponent
    ],
    providers: [
        PopupInputComponent
    ],
    entryComponents: [
        PopupInputComponent
    ]
})
export class SharedModule { }
