import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { MenuController } from '@ionic/angular';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';


@Component({
    templateUrl: 'gate.component.html',
    styleUrls: ['./gate.component.scss']
})
export class GateComponent {
    constructor(
        private router: Router,
        private menuCtrl: MenuController
    ) {
        this.menuCtrl.enable(false);
    }

    public import() {
        this.router.navigateByUrl('/wallet/import');
    }
    public create() {
        this.router.navigateByUrl('/wallet/create');
    }
}
