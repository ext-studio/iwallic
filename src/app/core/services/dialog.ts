import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Injectable()
export class DialogService {
    constructor(
        private loadCtrl: LoadingController,
        private toastCtrl: ToastController,
        private dialog: Dialogs,
        private platform: Platform
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
        if (this.platform.is('ios')) {
            return this.dialog.confirm(msg, title, [ok, no]).then((res) => {
                return res === 1;
            });
        } else {
            return Promise.resolve(confirm(msg));
        }
    }
}
