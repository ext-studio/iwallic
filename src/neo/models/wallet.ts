import { Observable } from 'rxjs/Observable';
import { wallet, u } from '..';
import AES from 'crypto-js/aes';
import hexEncoding from 'crypto-js/enc-hex';
import ECBMode from 'crypto-js/mode-ecb';
import NoPadding from 'crypto-js/pad-nopadding';
import SHA256 from 'crypto-js/sha256';
import latin1Encoding from 'crypto-js/enc-latin1';
import base58check from 'base58check';

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
            const addr = wallet.getAddressFromScriptHash(
                wallet.getScriptHashFromPublicKey(
                    wallet.getPublicKeyFromPrivateKey(
                        wallet.getPrivateKeyFromWIF(wif)
                    )
                )
            );
            const addressHash = SHA256(SHA256(latin1Encoding.parse(addr))).toString().slice(0, 8);
            const derived1 = scrypt.slice(0, 64);
            const derived2 = scrypt.slice(64);
            const xor = u.hexXor(wallet.getPrivateKeyFromWIF(wif), derived1);
            const encrypted = AES.encrypt(
                hexEncoding.parse(xor),
                hexEncoding.parse(derived2),
                { mode: ECBMode, padding: NoPadding }
            );
            const assembled = '0142' + 'e0' + addressHash + encrypted.ciphertext.toString();
            const encryptedKey = base58check.encode(assembled, '0x');
            observer.next(new Account({
                key: encryptedKey,
                address: addr,
                wif: wif,
                contract: Contract.fromWallet(
                    wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif))
                )
            }));
            observer.complete();
        });
    }
    public Verify(scrypt: string): Observable<any> {
        return new Observable((observer) => {
            const assembled = base58check.decode(this.key, 'hex');
            const addressHash = (assembled.prefix + assembled.data).substr(6, 8);
            const encrypted = (assembled.prefix + assembled.data).substr(-64);
            const derived1 = scrypt.slice(0, 64);
            const derived2 = scrypt.slice(64);
            const ciphertext = { ciphertext: hexEncoding.parse(encrypted), salt: '' };
            const decrypted = AES.decrypt(ciphertext, hexEncoding.parse(derived2), { mode: ECBMode, padding: NoPadding });
            const privateKey = u.hexXor(decrypted.toString(), derived1);
            const wif = wallet.getWIFFromPrivateKey(privateKey);
            const addr = wallet.getAddressFromScriptHash(
                wallet.getScriptHashFromPublicKey(
                    wallet.getPublicKeyFromPrivateKey(privateKey)
                )
            );
            const gotAH = SHA256(SHA256(latin1Encoding.parse(addr))).toString().slice(0, 8);
            if (addressHash === gotAH) {
                this.wif = wif;
                observer.next(this.wif);
                observer.complete();
            } else {
                observer.error('verify_failed');
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
                throw 'not_nep6';
            }
            this.accounts.push(acc);
        }
        this.extra = nep6['extra'] || null;
        this.verified = nep6['verified'] || false;
        this.backup = nep6['backup'] || false;
        if (!this.accounts.length) {
            throw 'not_nep6';
        }
    }
    public static fromWIF(wif: string, scrypt: string): Observable<Wallet> {
        return Account.fromWIF(wif, scrypt).map((acc) => {
            const wal = new Wallet({accounts: [acc]});
            wal.verified = true;
            return wal;
        });
    }
    public Verify(scrypt: string): Observable<any> {
        return this.account.Verify(scrypt).map((res) => {
            this.verified = true;
            return res;
        });
    }
}
