import { Injectable } from '@angular/core';
import { wallet, UtilService } from '.';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromPromise';
import { Storage } from '@ionic/storage';
import * as sha from 'sha.js';
import { WalletCreateComponent } from '../pages';

export function getAddressFromWIF(wif: string): string {
    return wallet.getAddressFromScriptHash(
        wallet.getScriptHashFromPublicKey(
            wallet.getPublicKeyFromPrivateKey(
                wallet.getPrivateKeyFromWIF(wif)
            )
        )
    );
}

export class Contract {
    public script: string;
    public parameters: Array<{
        name: string,
        type: string
    }> = [];
    public deployed: boolean = false;
    constructor(
        data?: any
    ) {
        data = data || {};
        this.script = data['script'] || null;
        const params = data['parameters'] || [{name: 'signature', type: 'Signature'}];
        for (const param of params) {
            this.parameters.push({
                name: param['name'] || null,
                type: param['type'] || null
            });
        }
        this.deployed = data['deployed'] || false;
    }
    public static fromWallet(pubKey: string): Contract {
        return new Contract({script: pubKey});
    }
}

export class Account {
    public address: string;
    public label: string[];
    public isDefault: boolean = false;
    public lock: boolean = false;
    public key: string;
    public contract;
    public extra: string;
    public wif: string = null;
    constructor(
        data?: any
    ) {
        data = data || {};
        this.key = data['key'] || null;
        this.address = data['address'] || null;
        this.label = data['label'] || null;
        this.isDefault = data['isDefault'] || false;
        this.lock = data['lock'] || false;
        this.extra = data['extra'] || null;
        this.contract = new Contract(data['contract']);
        this.wif = data['wif'] || null;
    }
    public static fromWIF(wif: string, pwd: string): Account {
        const key = wallet.encrypt(wif, pwd);
        const addr = getAddressFromWIF(wif);
        return new Account({
            key: key,
            address: addr,
            wif: wif,
            contract: Contract.fromWallet(
                wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif))
            )
        });
    }
    public Verify(pwd: string): Observable<any> {
        return new Observable((observer) => {
            setTimeout(() => {
                try {
                    console.log(this.key, pwd);
                    const check = wallet.decrypt(this.key, pwd);
                    if (check) {
                        observer.next(true);
                        observer.complete();
                    } else {
                        observer.error('verify_failed');
                    }
                } catch {
                    observer.error('verify_failed');
                }
            }, 200);
        });
    }
}

export class Wallet {
    public name: string = null;
    public version: string = '1.0';
    public scrypt = { n: 16384, r: 8, p: 8 };
    public accounts: Account[] = [];
    public extra: string = null;
    public get wif() {
        if (!this.verified) {
            return null;
        }
        return this.accounts[this.main].wif;
    }
    public get account() {
        return this.accounts[this.main];
    }
    private verified: boolean = false;
    private main: number = 0;
    constructor(
        nep6?: any
    ) {
        nep6 = nep6 || {};
        this.name = nep6['name'] || null;
        this.version = nep6['version'] || '1.0';
        this.scrypt.n = nep6['scrypt'] && (nep6['scrypt']['n'] || 16384) || 16384;
        this.scrypt.r = nep6['scrypt'] && (nep6['scrypt']['r'] || 8) || 8;
        this.scrypt.p = nep6['scrypt'] && (nep6['scrypt']['p'] || 8) || 8;
        for (const account of nep6['accounts'] || []) {
            this.accounts.push(new Account(account));
        }
        this.extra = nep6['extra'] || null;
        // 设置一个主地址
    }
    public static fromWIF(wif: string, pwd: string): Wallet {
        const wal = new Wallet({accounts: [Account.fromWIF(wif, pwd)]});
        wal.verified = true;
        return wal;
    }
    public Verify(pwd: string): Observable<any> {
        return this.account.Verify(pwd).map((res) => {
            this.verified = true;
            return res;
        });
    }
}

@Injectable()
export class WalletService {
    private cached: Wallet;
    constructor(
        private util: UtilService,
        private storage: Storage
    ) {
        // console.log(wallet.decrypt(''));
    }

    /**
     * import a wallet from WIF or NEP-6 JSON
     * @param text file content in JSON or WIF
     * @param type resolve as WIF-key or NEP-6 JSON
     */
    public Import(text: string, pwd: string, type: 'NEP2' | 'NEP6'): Observable<any> {
        return new Observable((observer) => {
            if (type === 'NEP2') {
                // 传入的是WIF 对其进行加密并转NEP-6
                observer.next(Wallet.fromWIF(text, pwd));
                observer.complete();
            } else if (type === 'NEP6') {
                // 传入的就是NEP-6 JSON 校验密码
                observer.error('unsupport');
            } else {
                observer.error('type_error');
            }
        });
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
        return new Observable((observer) => {
            setTimeout(() => {
                const wif = wallet.getWIFFromPrivateKey(wallet.generatePrivateKey());
                observer.next(Wallet.fromWIF(wif, pwd));
                observer.complete();
            }, 200);
        });
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

    /**
     * get currently opened wallet
     * if not in cache, open from storaged NEP-6 wallet
     * if cache exist, return it
     */
    public Get(pwd?: string): Observable<any> {
        if (this.cached) {
            return Observable.of(this.cached);
        }
        if (!pwd) {
            return Observable.throw('need_verify');
        }
        return Observable.fromPromise(this.storage.get('wallet')).switchMap((res: Wallet) => {
            if (!res) {
                return Observable.throw('not_exist');
            }
            const w = new Wallet(res);
            return w.Verify(pwd).map((vres) => {
                this.cached = w;
                return this.cached;
            });
        });
    }

    public Check(): Observable<any> {
        return Observable.fromPromise(this.storage.get('wallet')).map((res) => {
            if (!res) {
                // tslint:disable-next-line:no-string-throw
                throw 'not_exist';
            }
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

    public Wallet(): Observable<any> {
        return Observable.of({wif: 'L1WPxDLrwwQujjHbNHDUwh94g7KL2T8hb64ZaGTJaFQHN6XK1Pwg'});
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
