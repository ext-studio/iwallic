import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, Alert, Loading, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UtilService, WalletService } from '../../neo';
import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';
import QrCodeWithLogo from 'qr-code-with-logo';

@Injectable()
export class GlobalService {
    public apiDomain: string = 'http://127.0.0.1:9999';
    constructor(
        private alert: AlertController,
        private loading: LoadingController,
        private translate: TranslateService,
        private platform: Platform,
        private clipBoard: Clipboard,
        private storage: Storage,
        private wallet: WalletService
    ) {}
    public switchI18N(name: string) {
        this.translate.use(name);
    }
    /**
     * Internal Alert by given type
     * UNKNOWN to unknown error
     * @param type internal alert type
     */
    public Alert(type: 'UNKNOWN' | 'INVALIDWIF'): Alert {
        let alert;
        switch (type) {
            case 'INVALIDWIF':
            alert = this.alert.create({
                title: 'Caution',
                subTitle: 'This WIF is invalid.',
                buttons: ['OK'],
                enableBackdropDismiss: true
            });
            alert.present();
            return alert;
            case 'UNKNOWN':
            default:
            alert = this.alert.create({
                title: 'Caution',
                subTitle: 'Oops.. Something went wrong here.',
                buttons: ['OK'],
                enableBackdropDismiss: true
            });
            alert.present();
            return alert;
        }
    }

    public Copy(selector: string): Promise<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.copyForBrowser(selector);
        } else {
            return this.clipBoard.copy(document.getElementById(selector).innerText);
        }

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

    public getQRCode(domId: any, data: any, width: number, logo: any = 'assets/asset/qrcode_logo.png' ) {
        const qrcode = document.getElementById(domId);
        QrCodeWithLogo.toImage({
            image: qrcode,
            content: data,
            width: width,
            logo: {
                src: 'assets/asset/qrcode_logo.png',
                radius: 8
            }
        });
        return ;
    }
}
