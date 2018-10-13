import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';


@Component({
    templateUrl: 'import.component.html',
    styleUrls: ['./import.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImportComponent {
    constructor(
        private router: Router,
        private location: Location
    ) {}

    public go() {
    }
}
