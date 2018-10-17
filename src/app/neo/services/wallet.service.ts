import { Injectable } from '@angular/core';
import { Observable, of, Observer, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Wallet } from '../models/wallet';
import { wallet } from '@cityofzion/neon-js';

@Injectable()
export class WalletService {
    public get address(): string {
        return this.cached && this.cached.address;
    }
    private cached: Wallet;
    constructor(
        private storage: Storage
    ) {}
    /**
     * check is there wallet opened
     */
    public init(): Observable<Wallet> {
        return Observable.create((observer: Observer<Wallet>) => {
            this.storage.get('wallet').then((res: Wallet) => {
                if (res) {
                    this.cached = res;
                    observer.next(res);
                    observer.complete();
                } else {
                    observer.error(99894);
                }
            }).catch((err) => {
                observer.error(99894);
            });
        });
    }
    /***
     * verify current wallet and open it
     * reguard a wallet be opened just after it imported or created,
     * only for a payment is this method needed
     */
    public verify(pwd: string): Observable<Wallet> {
        if (!this.cached) {
            return throwError(99895);
        }
        return this.cached.Verify(pwd);
    }
    /**
     * generate new wallet
     * include address, wif key, encryped key
     * @param pwd password
     */
    public create(pwd: string): Observable<{
        key: string,
        address: string,
        wif: string
    }> {
        return Observable.create((observer: Observer<{
            key: string,
            address: string,
            wif: string
        }>) => {
            const privKey = wallet.generatePrivateKey();
            const wif = wallet.getWIFFromPrivateKey(privKey);
            const address = wallet.getAddressFromScriptHash(wallet.getScriptHashFromPublicKey(wallet.getPublicKeyFromPrivateKey(privKey)));
            (wallet.encryptAsync(wif, pwd) as any).then((res) => {
                observer.next({
                    key: res,
                    address: address,
                    wif: wif
                });
                observer.complete();
            }).catch(() => {
                observer.error(99899)
            });
        });
    }
    public nep2(pwd: string, wif: string): Observable<Wallet> {
        return Wallet.fromWIF(wif, pwd).pipe(map((w) => {
            // todo save new wallet
            return w;
        }));
    }
    public nep6(pwd: string, file: string): Observable<Wallet> {
        return Observable.create((observer: Observer<Wallet>) => {
            var fileObj = {};
            try {
                fileObj = JSON.parse(file);
                const w = new Wallet(fileObj);
                w.Verify(pwd).subscribe(() => {
                    // todo save new wallet
                    observer.next(w);
                    observer.complete();
                }, (err) => {
                    observer.error(err);
                });
                return;
            } catch {
                observer.error(99898);
                return;
            };
        });
    }
    /**
     * get history opened wallet in NEP6
     */
    public history(): Observable<Wallet[]> {
        return of([])
    }

    /**
     * Save WIF-key as NEP-6 JSON in storage
     * Only one wallet can be saved
     * @param key wallet key to save
     */
    public save(data: Wallet) {
        this.cached = data;
        this.storage.set('wallet', data);
        // todo save wallet to history list
    }

    public close() {
        this.cached = null;
        this.storage.remove('wallet');
    }
}
