import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListComponent {
    constructor(
        private router: Router
    ) {}

    go() {
        this.router.navigateByUrl('/transaction/transfer');
    }
    detail() {
        this.router.navigateByUrl('/asset/detail');
    }
}
