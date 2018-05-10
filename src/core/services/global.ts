import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, Alert, Loading, Platform, NavController, Config } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UtilService, WalletService } from '../../neo';
// import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';
import QrCodeWithLogo from 'qr-code-with-logo';
import { Translate } from './translate';

@Injectable()
export class GlobalService {
    public apiDomain: string = 'http://127.0.0.1:9999';
    public apiAddr: string = 'http://192.168.1.39:8080';
    constructor(
        private alert: AlertController,
        private loading: LoadingController,
        private translate: TranslateService,
        private trans: Translate,
        private platform: Platform,
        private storage: Storage,
        private wallet: WalletService,
        private config: Config
    ) {}
    /**
     * Internal Alert by given type
     * UNKNOWN to unknown error
     * @param type internal alert type
     */
    public Alert(type: 'UNKNOWN' | 'INVALIDWIF' | 'WRONGPWD' | 'REQUESTFAILED'): Observable<any> {
        console.log(type);
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

    public AlertI18N(config: {
        title?: string,
        content?: string,
        ok?: string,
        no?: string,
        enableBackdropDismiss?: boolean
    }): Observable<any> {
        return this.translate.get(
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
                    enableBackdropDismiss: config['enableBackdropDismiss']
                });
                alert.present();
                alert.onDidDismiss((data, role) => {
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

    public Copy(selector: string): Promise<any> {
        // if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.copyForBrowser(selector);
        // } else {
        //     return this.clipBoard.copy(document.getElementById(selector).innerText);
        // }
    }

    private copyForBrowser(selector: string): Promise<any> {
        return new Promise((res, rej) => {
            const target: any = window.document.getElementById(selector);
            if (window.navigator.userAgent.toLowerCase().match(/ipad|ipod|iphone/i)) {
                console.log('iphone');
                const oldContentEditable = target.contentEditable;
                const oldReadOnly = target.readOnly;
                const range = document.createRange();

                target.contenteditable = true;
                target.readonly = false;
                range.selectNodeContents(target);

                const s = window.getSelection();
                s.removeAllRanges();
                s.addRange(range);

                target.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

                if (document.execCommand('copy')) {
                    res();
                } else {
                    rej();
                }
                target.contentEditable = oldContentEditable;
                target.readOnly = oldReadOnly;
            } else {
                target.select();
                if (document.execCommand('copy')) {
                    res();
                } else {
                    rej();
                }
            }
        });
    }

    public SHAEncode(str: string): string {
        return str;
    }

    public getQRCode(domId: any, data: any, width: number, logo: any = 'assets/app/logo.png' ) {
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
