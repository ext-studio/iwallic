import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { wallet } from '@cityofzion/neon-js';

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
    }
    public static fromWIF(wif: string, pwd: string): Observable<Account> {
        return new Observable((observer) => {
            const pubKey = wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif))
            const addr = wallet.getAddressFromScriptHash(wallet.getScriptHashFromPublicKey(pubKey));
            (wallet.encryptAsync(wif, pwd) as any).then((res) => {
                console.log(res);
                observer.next(new Account({
                    key: res,
                    address: addr,
                    wif: wif,
                    contract: Contract.fromWallet(
                        pubKey
                    )
                }));
                observer.complete();
            }).catch((err) => {
                observer.error(99897);
            });
        });
    }
    public Verify(pwd: string): Observable<string> {
        return new Observable((observer) => {
            (wallet.decryptAsync(this.key, pwd) as any).then((res) => {
                if (res) {
                    observer.next(res);
                    observer.complete();
                } else {
                    observer.error(99899);
                }
            }).catch((err) => {
                observer.error(99899);
            });
        });
    }
}

export class Wallet {
    public name: string = null;
    public version: string = '1.0';
    public scrypt = { n: 16384, r: 8, p: 8 };
    public accounts: Account[] = [];
    public extra: string = null;
    public backup: boolean = false;
    public get address() {
        return this.accounts[this.main] && this.accounts[this.main].address;
    }
    public get account() {
        return this.accounts[this.main];
    }
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
            const acc = new Account(account);
            if (!acc.key && !acc.address) {
                throw 99986;
            }
            this.accounts.push(acc);
        }
        this.extra = nep6['extra'] || null;
        if (!this.accounts.length) {
            throw 99986;
        }
    }
    public static fromKey(key: string, pubKey: string): Wallet {
        const account = new Account({
            key: key,
            address: wallet.getAddressFromScriptHash(wallet.getScriptHashFromPublicKey(pubKey)),
            contract: Contract.fromWallet(pubKey)
        });
        return new Wallet({
            accounts: [account]
        });
    }
    public static fromWIF(wif: string, pwd: string): Observable<Wallet> {
        return Account.fromWIF(wif, pwd).pipe(map((acc) => {
            return new Wallet({accounts: [acc]});;
        }));
    }
    public Verify(pwd: string): Observable<any> {
        return this.account.Verify(pwd);
    }
}
