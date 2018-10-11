import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NEP2, WALLET } from '../utils';

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
    public static fromWIF(wif: string, scrypt: string): Observable<Account> {
        return new Observable((observer) => {
            const addr = WALLET.wif2addr(wif);
            observer.next(new Account({
                key: NEP2.encode(addr, wif, scrypt),
                address: addr,
                wif: wif,
                contract: Contract.fromWallet(
                    WALLET.priv2pub(WALLET.wif2priv(wif))
                )
            }));
            observer.complete();
        });
    }
    public Verify(scrypt: string): Observable<any> {
        return new Observable((observer) => {
            const decode = NEP2.decode(scrypt, this.key);
            if (decode) {
                this.wif = decode;
                observer.next(this.wif);
                observer.complete();
            } else {
                observer.error(99987);
            }
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
    public get wif() {
        if (!this.verified) {
            return null;
        }
        return this.accounts[this.main].wif;
    }
    public get address() {
        return this.accounts[this.main] && this.accounts[this.main].address;
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
            const acc = new Account(account);
            if (!acc.key && !acc.address) {
                throw 99986;
            }
            this.accounts.push(acc);
        }
        this.extra = nep6['extra'] || null;
        this.verified = nep6['verified'] || false;
        this.backup = nep6['backup'] || false;
        if (!this.accounts.length) {
            throw 99986;
        }
    }
    public static fromWIF(wif: string, scrypt: string): Observable<Wallet> {
        return Account.fromWIF(wif, scrypt).pipe(map((acc) => {
            const wal = new Wallet({accounts: [acc]});
            wal.verified = true;
            return wal;
        }));
    }
    public Verify(scrypt: string): Observable<any> {
        return this.account.Verify(scrypt).pipe(map((res) => {
            this.verified = true;
            return res;
        }));
    }
}
