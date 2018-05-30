import { Injectable, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { PopupInputComponent } from '../directives/popup-input/popup-input.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';

@Injectable()
export class PopupInputService {
    constructor() { }
    public open(
        navCtrl: NavController
    ) {
        const $enter: Subject<any> = new Subject<any>();
        navCtrl.push(PopupInputComponent, {subject: $enter});
        return $enter.asObservable();
    }
}
