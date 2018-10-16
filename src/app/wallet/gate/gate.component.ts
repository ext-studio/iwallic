import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';


@Component({
    templateUrl: 'gate.component.html',
    styleUrls: ['./gate.component.scss']
})
export class GateComponent {
    constructor(
        private router: Router,
        private location: Location
    ) {}

    public import() {
        this.router.navigateByUrl('/wallet/import');
    }
    public create() {
        this.router.navigateByUrl('/wallet/create');
    }
}
