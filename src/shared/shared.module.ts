import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupInputComponent } from './components/popup-input/popup-input.component';

@NgModule({
    imports: [
        CommonModule, FormsModule
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
