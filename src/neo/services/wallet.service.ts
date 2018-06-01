import { Injectable } from '@angular/core';
import { wallet, UtilService } from '../';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import { Storage } from '@ionic/storage';
import { WalletCreateComponent } from '../../pages';
import { Wallet } from '../models/wallet';
import { Subject } from 'rxjs/Subject';
import CryptoJS from 'crypto-js';

export function getAddressFromWIF(wif: string): string {
    return wallet.getAddressFromScriptHash(
        wallet.getScriptHashFromPublicKey(
            wallet.getPublicKeyFromPrivateKey(
                wallet.getPrivateKeyFromWIF(wif)
            )
        )
    );
}

@Injectable()
export class WalletService {
    public get address(): string {
        return this.cached && this.cached.address;
    }
    public get wif(): string {
        return this.cached && this.cached.wif;
    }
    public get backup(): boolean {
        return this.cached && this.cached.backup;
    }
    private cached: Wallet;
    constructor(
        private util: UtilService,
        private storage: Storage
    ) {
        //
    }
    public Verify(pwd: string, w?: Wallet, skipSave?: boolean): Observable<any> {
        if (!this.cached && !w) {
            return Observable.throw('not_exist');
        }
        if (w) {
            this.cached = w;
        }
        return this.cached.Verify(pwd).map((res) => {
            if (!skipSave) {
                console.log('skip_save');
                this.Save(res);
            }
            return res;
        });
    }
    /**
     * import a wallet from WIF or NEP-6 JSON
     * @param text file content in JSON or WIF
     * @param type resolve as WIF-key or NEP-6 JSON
     */
    public Import(text: string, pwd: string, type: 'NEP2' | 'NEP6'): Observable<any> {
        if (type === 'NEP2') {
            return Wallet.fromWIF(text, pwd);
        } else if (type === 'NEP6') {
            return Observable.throw('unsupport');
        } else {
            return Observable.throw('type_error');
        }
    }
    /**
     * export wallet as JSON file by name
     * @param name  name of wallet to export as file
     */
    public Export(name: string): Observable<any> {
        return Observable.throw('unsupport');
    }

    /**
     * create a new NEP-2 wallet
     * generate and encrypt private key by neon-js
     */
    public Create(pwd: string = 'iwallic'): Observable<Wallet> {
        return Wallet.fromWIF(wallet.getWIFFromPrivateKey(wallet.generatePrivateKey()), pwd);
    }

    /**
     * Save WIF-key as NEP-6 JSON in storage
     * Only one wallet can be saved
     * @param key wallet key to save
     */
    public Save(data: Wallet): void {
        this.cached = data;
        this.storage.set('wallet', data);
    }

    public SaveBackup(data: Wallet): void {
        data.backup = true;
        this.cached = data;
        this.storage.set('wallet', data);
    }

    /**
     * get currently opened wallet
     * if not in cache, open from storaged NEP-6 wallet
     * if cache exist, return it
     */
    public Get(pwd?: string): Observable<any> {
        if (this.cached && !pwd) {
            return Observable.of(this.cached);
        }
        return Observable.fromPromise(this.storage.get('wallet')).switchMap((res: Wallet) => {
            if (!res) {
                return Observable.throw('not_exist');
            }
            const w = new Wallet(res);
            // cached wif to avoid entering pwd each time
            if (w.wif) {
                this.cached = w;
                return Observable.of(this.cached);
            }
            if (!pwd) {
                return Observable.throw('need_verify');
            }
            return w.Verify(pwd).map((vres) => {
                this.cached = w;
                this.Save(w);
                return this.cached;
            });
        });
    }

    /**
     * close wallet in storage
     */
    public Close(): void {
        this.cached = null;
        this.storage.remove('wallet');
    }

    public GetAddressFromWIF(wif: string): string {
        return getAddressFromWIF(wif);
    }

    public CheckWIF(wif: string): boolean {
        return wallet.isWIF(wif);
    }

    public Backup() {
        this.cached.backup = true;
        this.storage.get('wallet').then((res) => {
            res['backup'] = true;
            this.storage.set('wallet', res);
        });
    }

    public decryptNep2(enckey: any, pwd: any): Observable<any> {
        return new Observable((observable) => {
            const privateKey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
            observable.next(wallet.getWIFFromPrivateKey(privateKey));
        });
    }
}
