import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';

import { Dialogs } from '@ionic-native/dialogs/ngx';

@Injectable()
export class DialogService {
    constructor(
        private loadCtrl: LoadingController,
        private toastCtrl: ToastController,
        private dialog: Dialogs,
        private platform: Platform,
        private alertCtrl: AlertController
    ) {}
    public async loader(msg: string = '') {
        const loading = await this.loadCtrl.create({
            message: msg,
            duration: 20000
        });
        loading.present()
        return loading;
    }
    public async toast(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            position: 'top',
            duration: 2000
        });
        toast.present();
    }
    public confirm(msg: string, title: string, ok: string = 'OK', no: string = 'Cancel') {
        return new Promise((resolve) => {
            this.alertCtrl.create({
                header: title,
                message: msg,
                buttons: [{
                    text: no,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve(false);
                    }
                }, {
                    text: ok,
                    handler: () => {
                        resolve(true);
                    }
                }]
            }).then((alert) => {
                alert.present()
            });
        });
    }
    public password() {
        return new Promise((resolve) => {
            this.alertCtrl.create({
                header: 'Prompt!',
                inputs: [{
                    name: 'pwd',
                    type: 'password',
                    placeholder: 'Enter your password'
                }],
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve();
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        resolve(data['pwd']);
                    }
                }]
            }).then((alert) => {
                alert.present();
            });
        });
    }
}
