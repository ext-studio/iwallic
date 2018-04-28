import { Injectable } from '@angular/core';
import { wallet, UtilService } from '.';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Storage } from '@ionic/storage';
import * as sha from 'sha.js';

@Injectable()
export class WalletService {
    private cacheWIF: {
        wif: string,
        backup: boolean
    };
    constructor(
        private util: UtilService,
        private storage: Storage
    ) {
        // console.log(wallet.decrypt(''));
    }

    /**
     * create a new NEP-2 wallet
     * generate and encrypt private key by neon-js
     */
    public Create(pwd: string = 'iwallic'): Observable<{
        key: string,
        wif: string
    }> {
        return new Observable<{
            key: string,
            wif: string
        }>((observer) => {
            const wif = wallet.getWIFFromPrivateKey(wallet.generatePrivateKey());
            const addr = this.GetAddressFromWIF(wif);
            const encKey = wallet.encrypt(wif, pwd);
            observer.next({key: encKey, wif: wif});
            observer.complete();
        });
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

    public Wallet(pwd?: string): Observable<{
        wif: string,
        backup: boolean
    }> {
        return new Observable<any>((observer) => {
            if (!pwd) {
                if (this.cacheWIF) {
                    observer.next(this.cacheWIF);
                    observer.complete();
                    return;
                } else {
                    observer.error('need_pwd');
                    return;
                }
            }
            this.storage.get('wallet').then((res: {
                key: string,
                backup: boolean
            }) => {
                if (!res || !res.key) {
                    observer.error('not_exist');
                    return;
                }
                this.cacheWIF = {wif: wallet.decrypt(res.key, pwd), backup: res.backup};
                observer.next(this.cacheWIF);
                observer.complete();
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
    public SetWallet(key: string): Promise<any> {
        return this.storage.set('wallet', {
            key: key,
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
