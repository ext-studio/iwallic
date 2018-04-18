import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, Alert, Loading } from 'ionic-angular';

@Injectable()
export class GlobalService {
    public apiDomain: string = 'http://127.0.0.1:9999';
    constructor(
        private alert: AlertController,
        private loading: LoadingController,
        private translate: TranslateService
    ) {}
    public switchI18N(name: string) {
        this.translate.use(name);
    }
    /**
     * Internal Alert by given type
     * UNKNOWN to unknown error
     * @param type internal alert type
     */
    public Alert(type: 'UNKNOWN'): Alert {
        switch (type) {
            case 'UNKNOWN':
            default:
            const alert = this.alert.create({
                title: 'Caution',
                subTitle: 'Oops.. Something went wrong here.',
                buttons: ['OK'],
                enableBackdropDismiss: true
            });
            alert.present();
            return alert;
        }
    }
}
