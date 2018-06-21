import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Storage } from '@ionic/storage';
import { GlobalService, HttpService } from '../../core';
import { Wallet } from '../models/wallet';
import { WALLET, SCRYPT } from '../utils';
import CryptoJS from 'crypto-js';

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
        private storage: Storage,
        private http: HttpService,
        private global: GlobalService
    ) {
        //
    }
    public Verify(pwd: string, w?: Wallet, skipSave?: boolean): Observable<any> {
        // scrypt
        if (!this.cached && !w) {
            return Observable.throw(99983);
        }
        if (w) {
            this.cached = w;
        }
        return this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'scryptaddr',
            params: [this.cached.address, pwd]
        }).catch(() => SCRYPT(this.cached.address, pwd))
        .switchMap((scrypt: string) => this.cached.Verify(scrypt)).map((res) => {
            if (!skipSave) {
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
    public ImportWIF(wif: string, pwd: string): Observable<any> {
            const addr = WALLET.wif2addr(wif);
            return this.http.post(`${this.global.apiDomain}/api/iwallic`, {
                method: 'scryptaddr',
                params: [addr, pwd]
            }).catch(() =>  SCRYPT(addr, pwd))
            .switchMap((scrypt: string) => Wallet.fromWIF(wif, scrypt));
    }
    /**
     * export wallet as JSON file by name
     * @param name  name of wallet to export as file
     */
    public Export(name: string): Observable<any> {
        return Observable.throw(99982);
    }

    /**
     * create a new NEP-2 wallet
     * generate and encrypt private key by neon-js
     */
    public Create(pwd: string = 'iwallic'): Observable<Wallet> {
        const newWif = WALLET.priv2wif(WALLET.generate());
        const addr = WALLET.wif2addr(newWif);
        return this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'scryptaddr',
            params: [addr, pwd]
        }).catch(() =>  SCRYPT(addr, pwd))
        .switchMap((scrypt: string) => Wallet.fromWIF(newWif, scrypt));
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
        return new Observable((observer) => {
            this.storage.get('wallet').catch(() => Promise.resolve()).then((res) => {
                if (!res) {
                    observer.error(99983);
                    return;
                }
                const w = new Wallet(res);
                // cached wif to avoid entering pwd each time
                if (w.wif) {
                    this.cached = w;
                    observer.next(this.cached);
                    observer.complete();
                    return;
                }
                if (!pwd) {
                    return Observable.throw(99981);
                }
                w.Verify(pwd).subscribe(() => {
                    this.cached = w;
                    this.Save(w);
                    observer.next(this.cached);
                    observer.complete();
                    return;
                }, (err) => {
                    observer.error(err);
                    return;
                });
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

    public CheckWIF(wif: string): boolean {
        return WALLET.checkWIF(wif);
    }

    public CheckAddress(address: string): boolean {
        return WALLET.checkAddress(address);
    }

    public Backup() {
        this.cached.backup = true;
        this.storage.get('wallet').then((res) => {
            res['backup'] = true;
            this.storage.set('wallet', res);
        });
    }

    public verifyNep2(enckey: any, publicKey: any, pwd: any): Observable<any> {
        return new Observable((observable) => {
            if (/^[0-9]+$/.test(CryptoJS.AES.decrypt(enckey, pwd).toString())) {
                const privateKey = CryptoJS.AES.decrypt(enckey, pwd).toString(CryptoJS.enc.Utf8);
                if (publicKey === WALLET.priv2pub(privateKey)) {
                    observable.next(WALLET.priv2wif(privateKey));
                    observable.complete();
                    return;
                }
            }
            observable.error(99987);
        });
    }
}
