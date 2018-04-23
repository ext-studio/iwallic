import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, Alert, Loading, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UtilService, WalletService } from '../../neo';
import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';

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

    public Wallet(): Observable<any> {
        return new Observable<any>((observer) => {
            this.storage.get('wallet').then((res) => {
                console.log(res);
                if (!(res && res.wif)) {
                    observer.error('not_exist');
                    return;
                }
                observer.next({
                    address: this.wallet.GetAddressFromWIF(res.wif),
                    wif: res.wif
                });
                return;
            }).catch((err) => {
                observer.error(err);
                return;
            });
        });
    }

    public SetWallet(wif: string, key: string): Promise<any> {
        return this.storage.set('wallet', {
            wif: wif,
            key: this.SHAEncode(key)
        });
    }

    public Match(key: string): Promise<any> {
        return this.storage.get('wallet').then((res: any) => {
            if (res && (res['key'] === this.SHAEncode(key))) {
                return Promise.resolve(true);
            } else {
                return Promise.reject('not_match');
            }
        });
    }

    public SHAEncode(str: string): string {
        return str;
    }
}
