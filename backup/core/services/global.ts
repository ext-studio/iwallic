import { Injectable } from '@angular/core';
import { TranslateService as NgTranslateService } from '@ngx-translate/core';
import {
    AlertController, LoadingController, Loading, ToastController
} from 'ionic-angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import QrCodeWithLogo from 'qr-code-with-logo';
import { ThemeService } from './theme';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {
    ThemeableBrowser, ThemeableBrowserOptions
} from '@ionic-native/themeable-browser/ngx';

const options: ThemeableBrowserOptions = {
    statusbar: {
        color: '#ffffffff'
    },
    toolbar: {
        height: 44,
        color: '#f0f0f0ff'
    },
    title: {
        color: '#003264ff',
        showPageTitle: true
    },
    closeButton: {
        wwwImage: '/assets/icon/close.png',
        align: 'left',
        wwwImageDensity: 2
    },
    backButtonCanClose: true
};

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
        private iab: InAppBrowser,
        private themeableBrowser: ThemeableBrowser,
        private clipboard: Clipboard
    ) {}
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
        return (msg ? this.ngTranslate.get(msg) : of('')).pipe(switchMap((res) => {
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
        }));
    }

    /**
     * Make a toast supporting translate
     * @param msg translate key
     * @param duration during time
     */
    public ToastI18N(msg: string, duration: number = 2000): Observable<any> {
        return this.ngTranslate.get(msg).pipe(switchMap((res) => {
            return new Observable<any>((observer) => {
                const toast = this.toast.create({message: res, duration: duration, cssClass: `toast-${this.theme.current()}`});
                toast.present();
                toast.onDidDismiss(() => {
                    observer.next();
                    observer.complete();
                });
            });
        }));
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
        ).pipe(switchMap((res) => {
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
        }));
    }

    public Error(err): Observable<any> {
        console.log(err);
        if (typeof err !== 'number') {
            return this.ToastI18N('ERROR_REQUESTFAILED');
        }
        switch (err) {
            case 1003: // 'Invoke Method Error'
            return this.ToastI18N('ERROR_METHOD_ERROR');
            case 99999:
            return this.ToastI18N('ERROR_UNKNOWN');
            case 99998: // Network error
            return this.ToastI18N('ERROR_NETWORK');
            case 1000: // no data
            case 99997: // Offline
            case 99996: // Platform not support
            case 99995: // No need
            case 99980: // User canceled
            return of();
            default:
            return new Observable<any>((observer) => {
                const toast = this.toast.create({message: `[${err}]`, duration: 2000, cssClass: `toast-${this.theme.current()}`});
                toast.present();
                toast.onDidDismiss(() => {
                    observer.next();
                    observer.complete();
                });
            });
        }
    }

    /**
     * Copy the value of an input DOM
     * @param selector the dom taken value to copy
     */
    public Copy(content: string): Promise<any> {
        return this.clipboard.copy(content).catch((err) => {
            this.ngTranslate.get(
                ['ALERT_COPY_TITLE', 'ALERT_COPY_MESSAGE', 'ALERT_NO_CLOSE']
            ).subscribe((config) => {
                const bool = true;
                this.alert.create({
                    title: config['ALERT_COPY_TITLE'],
                    subTitle: config['ALERT_COPY_MESSAGE'],
                    inputs: [
                        {
                            value: content,
                            disabled: bool
                        },
                    ],
                    buttons: [
                        config['ALERT_NO_CLOSE']
                    ]
                }).present();
            }, () => {
                this.ToastI18N('TOAST_CONTENT_COPYFAILED').subscribe();
            });
            return Promise.resolve(false);
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

    public browser(url: string, type: 'INAPP' | 'THEMEABLE') {
        if (type === 'INAPP') {
            this.iab.create(url, '_system').show();
        } else {
            const tb = this.themeableBrowser.create(url, '_blank', options);
            tb.insertCss({code: 'html {background: #f3f3f3;} body {margin-top: 44px;}'});
        }
    }
}