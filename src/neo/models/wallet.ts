import { Observable } from 'rxjs/Observable';
import { wallet } from '..';

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
    public static fromWIF(wif: string, pwd: string): Observable<Account> {
        return Observable.fromPromise(wallet.encryptAsync(wif, pwd) as any).map((res) => {
            const addr = wallet.getAddressFromScriptHash(
                wallet.getScriptHashFromPublicKey(
                    wallet.getPublicKeyFromPrivateKey(
                        wallet.getPrivateKeyFromWIF(wif)
                    )
                )
            );
            return new Account({
                key: res,
                address: addr,
                wif: wif,
                contract: Contract.fromWallet(
                    wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif))
                )
            });
        });
    }
    public Verify(pwd: string): Observable<any> {
        return Observable.fromPromise((wallet.decryptAsync(this.key, pwd) as any)).map((res: any) => {
            if (res) {
                this.wif = res;
                return true;
            } else {
                throw 'verify_failed';
            }
        }).catch((err) => {
            console.log(err);
            return Observable.throw('verify_failed');
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
            this.accounts.push(new Account(account));
        }
        this.extra = nep6['extra'] || null;
        this.verified = nep6['verified'] || false;
        this.backup = nep6['backup'] || false;
    }
    public static fromWIF(wif: string, pwd: string): Observable<Wallet> {
        return Account.fromWIF(wif, pwd).map((acc) => {
            const wal = new Wallet({accounts: [acc]});
            wal.verified = true;
            return wal;
        });
    }
    public Verify(pwd: string): Observable<any> {
        return this.account.Verify(pwd).map((res) => {
            this.verified = true;
            return res;
        });
    }
}
