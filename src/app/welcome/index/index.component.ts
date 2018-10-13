import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    constructor(
        private router: Router,
        private location: Location
    ) {
        /**
         * if first enter jump to guide page directly
         * or goto wallet or asset page delay
         * or touch to skip delay
         */
        setTimeout(() => {
            this.router.navigateByUrl('/asset', {replaceUrl: true});
        }, 3000);
    }

    public skip() {
        this.router.navigateByUrl('/asset', {replaceUrl: true});
    }
}
