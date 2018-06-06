import { Injectable } from '@angular/core';
import { TranslateService as NgTranslateService } from '@ngx-translate/core';
import {
    AlertController, LoadingController, Loading, ToastController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import QrCodeWithLogo from 'qr-code-with-logo';
import { ThemeService } from './theme';
import { NetService } from './net';
import { Platform, ItemSliding } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

@Injectable()
export class GlobalService {
    public popups: any[] = [];
    public masks: any[] = [];
    constructor(
        private alert: AlertController,
        private loading: LoadingController,
        private ngTranslate: NgTranslateService,
        private toast: ToastController,
        private theme: ThemeService,
        private net: NetService,
        private platform: Platform,
        private clipboard: Clipboard
    ) {}
    public get apiDomain(): string {
        return this.net.get('API');
    }
    public get rpcDomain(): string {
        return this.net.get('RPC');
    }
    /**
     * Internal Alert by given type
     * leave empty to unknown error
     * @param type internal alert type
     */
    public Alert(type: 'UNKNOWN' | 'INVALIDWIF' | 'WRONGPWD' | 'REQUESTFAILED' = 'UNKNOWN'): Observable<any> {
        switch (type) {
            case 'INVALIDWIF':
            return this.AlertI18N({title: 'ALERT_TITLE_CAUTION', content: 'ALERT_CONTENT_INVALIDWIF', ok: 'ALERT_OK_SURE'});
            case 'WRONGPWD':
            return this.AlertI18N({title: 'ALERT_TITLE_CAUTION', content: 'ALERT_CONTENT_WRONGPWD', ok: 'ALERT_OK_SURE'});
            case 'REQUESTFAILED':
            return this.AlertI18N({title: 'ALERT_TITLE_CAUTION', content: 'ALERT_CONTENT_REQUESTFAILED', ok: 'ALERT_OK_SURE'});
            case 'UNKNOWN':
            default:
            return this.AlertI18N({title: 'ALERT_TITLE_CAUTION', content: 'ALERT_CONTENT_UNKNOWN', ok: 'ALERT_OK_SURE'});
        }
    }

    /**
     * Make a load bar supporting translate
     * @param msg translate key
     */
    public LoadI18N(msg?: string): Observable<Loading> {
        return (msg ? this.ngTranslate.get(msg) : Observable.of('')).switchMap((res) => {
            return new Observable<Loading>((observer) => {
                const load = this.loading.create({content: res, cssClass: `load-${this.theme.current()}`});
                this.masks.push(load);
                load.present();
                load.onDidDismiss(() => {
                    this.masks.splice(this.masks.findIndex((e: any) => e.id && (e.id === load.id)), 1);
                });
                observer.next(load);
                observer.complete();
            });
        });
    }

    /**
     * Make a toast supporting translate
     * @param msg translate key
     * @param duration during time
     */
    public ToastI18N(msg: string, duration: number = 2000): Observable<any> {
        return this.ngTranslate.get(msg).switchMap((res) => {
            return new Observable<any>((observer) => {
                const toast = this.toast.create({message: res, duration: duration, cssClass: `toast-${this.theme.current()}`});
                toast.present();
                toast.onDidDismiss(() => {
                    observer.next();
                    observer.complete();
                });
            });
        });
    }

    /**
     * Make an alert supporting translate
     * @param config alert config
     */
    public AlertI18N(config: {
        title?: string,
        content?: string,
        ok?: string,
        no?: string
    }): Observable<any> {
        return this.ngTranslate.get(
            [config['title'], config['content'], config['ok'], config['no']].filter((e) => !!e)
        ).switchMap((res) => {
            return new Observable<any>((observer) => {
                const btns = [];
                if (res[config['no']]) {
                    btns.push(res[config['no']]);
                }
                if (res[config['ok']]) {
                    btns.push({
                        text: res[config['ok']],
                        role: 'ok'
                    });
                }
                const alert = this.alert.create({
                    title: res[config['title']],
                    subTitle: res[config['content']],
                    buttons: btns,
                    cssClass: `alert-${this.theme.current()}`
                });
                this.popups.push(alert);
                alert.present();
                alert.onDidDismiss((data, role) => {
                    this.popups.splice(this.popups.findIndex((e: any) => e.id && (e.id === alert.id)), 1);
                    if (role === 'ok') {
                        observer.next(true);
                        observer.complete();
                    } else {
                        observer.next(false);
                        observer.complete();
                    }
                });
            });
        });
    }

    /**
     * Copy the value of an input DOM
     * @param selector the dom taken value to copy
     */
    public Copy(selector: string): Promise<any> {
        return new Promise((res, rej) => {
            const target: any = window.document.getElementById(selector);
            if (this.platform.is('core') || this.platform.is('mobileweb')) {
                target.select();
                if (document.execCommand('copy')) {
                    res();
                } else {
                    rej();
                }
            } else {
                target.select();
                this.clipboard.copy(target.value).then((cres) => {
                    res();
                }, (err) => {
                    rej();
                });
            }
        });
    }

    /**
     * Generate qrcode with specified data
     * @param domId which dom to set qrcode src
     * @param data text data
     * @param width image size
     * @param logo logo in the center
     */
    public GenerateQRCode(domId: any, data: any, width: number, logo: any = 'assets/app/logo.png' ) {
        const qrcode = document.getElementById(domId);
        QrCodeWithLogo.toImage({
            image: qrcode,
            content: data,
            width: width,
            logo: {
                src: logo,
                radius: 8
            }
        });
        return ;
    }
}
