import { Injectable } from '@angular/core';
import { wallet, UtilService } from '.';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Storage } from '@ionic/storage';
import * as sha from 'sha.js';

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
    /**
     * Save a WIF wallet into storage.
     * @param wif WIF key
     * @param key password
     */
    public SetWallet(wif: string, key: string): Promise<any> {
        return this.storage.set('wallet', {
            wif: wif,
            key: this.shaEncode(key),
            backup: false
        });
    }
    /**
     * Remove opened wallet.
     * Password will be removed too.
     */
    public CloseWallet() {
        this.storage.remove('wallet');
    }
    /**
     * Check if password matches opened wallet.
     * @param key password
     */
    public Match(key: string): Promise<any> {
        return this.storage.get('wallet').then((res: any): any => {
            if (res && (res['key'] === this.shaEncode(key))) {
                return Promise.resolve(true);
            } else {
                return Promise.reject('not_match');
            }
        });
    }

    public Backup() {
        this.storage.get('wallet').then((res) => {
            res['backup'] = true;
            this.storage.set('wallet', res);
        });
    }

    private shaEncode(key: string): string {
        return sha('sha256').update(key).digest('hex');
    }
}
