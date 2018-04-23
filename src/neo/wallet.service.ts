import { Injectable } from '@angular/core';
import { wallet, UtilService } from '.';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Storage } from '@ionic/storage';

@Injectable()
export class WalletService {

    constructor(
        private util: UtilService,
        private storage: Storage
    ) {}
    /**
     * generate new private key by neon-js
     * inner implements is ``window.crypto.getRandomValues()``
     */
    public Create(): Observable<string> {
        return Observable.of(wallet.getWIFFromPrivateKey(wallet.generatePrivateKey()));
    }

    public GetAddressFromWIF(wif: string): string {
        return wallet.getAddressFromScriptHash(
            wallet.getScriptHashFromPublicKey(
                wallet.getPublicKeyFromPrivateKey(
                    wallet.getPrivateKeyFromWIF(wif)
                )
            )
        );
    }

    public CheckWIF(wif: string): boolean {
        return wallet.isWIF(wif);
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
                    address: this.GetAddressFromWIF(res.wif),
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
            key: this.shaEncode(key)
        });
    }

    public Match(key: string): Promise<any> {
        return this.storage.get('wallet').then((res: any) => {
            if (res && (res['key'] === this.shaEncode(key))) {
                return Promise.resolve(true);
            } else {
                return Promise.reject('not_match');
            }
        });
    }

    private shaEncode(key: string): string {
        return key;
    }
}
