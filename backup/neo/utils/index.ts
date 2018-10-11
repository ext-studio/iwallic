
import CAES from 'crypto-js/aes';
import latin1Encoding from 'crypto-js/enc-latin1';
import SHA256 from 'crypto-js/sha256';
import hexEncoding from 'crypto-js/enc-hex';
import ECBMode from 'crypto-js/mode-ecb';
import NoPadding from 'crypto-js/pad-nopadding';
import bs58check from 'bs58check';
import { u, wallet, sc } from '@cityofzion/neon-js';
import { Buffer } from 'buffer';
import Scrypt from 'scrypt-js';
import { Observable } from 'rxjs';

export const ASSET = {
    NEO: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
    GAS: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
};

export const AES = {
    decode: (text: string, key: string) => {
        return CAES.decrypt(text, key);
    }
};

export const HEX = {
    fromBuffer: (buffer: any) => {
        return u.ab2hexstring(buffer);
    },
    xor: (hex1: string, hex2: string) => {
        return u.hexXor(hex1, hex2);
    },
    fromNumber: (num: number, size: number = 1, isLittleEnd = false) => {
        return u.num2hexstring(num, size, isLittleEnd);
    },
    fromString: (text: string) => {
        return u.str2hexstring(text);
    },
    reverse: (hex: string) => {
        return u.reverseHex(hex);
    },
    hash256: (hex: string) => {
        return u.hash256(hex);
    },
    forNum: (num: number) => {
        return u.num2VarInt(num);
    },
    forFixedNum: (num: number) => {
        return u.num2fixed8(num);
    }
};

export function SCRYPT(addr, pwd) {
    return new Observable((observer) => {
        const addressHash = SHA256(SHA256(latin1Encoding.parse(addr))).toString().slice(0, 8);
        Scrypt(Buffer.from(pwd.normalize('NFC'), 'utf8'), Buffer.from(addressHash, 'hex'), 16384, 8, 8, 64, (a, b, c) => {
            if (c) {
                observer.next(Buffer.from(c).toString('hex'));
                observer.complete();
                return;
            }
            if (a) {
                observer.error(99985);
                return;
            }
        });
    });
}

export const WALLET = {
    addr2hash: (addr: string) => {
        return wallet.getScriptHashFromAddress(addr);
    },
    hash2addr: (addr: string) => {
        return wallet.getAddressFromScriptHash(addr);
    },
    priv2pub: (priv: string) => {
        return wallet.getPublicKeyFromPrivateKey(priv);
    },
    pub2hash: (pub: string) => {
        return wallet.getScriptHashFromPublicKey(pub);
    },
    wif2addr: (wif: string) => {
        return WALLET.hash2addr(
            WALLET.pub2hash(
                WALLET.priv2pub(
                    WALLET.wif2priv(wif)
                )
            )
        );
    },
    wif2priv: (wif: string) => {
        return wallet.getPrivateKeyFromWIF(wif);
    },
    priv2wif: (wif: string) => {
        return wallet.getWIFFromPrivateKey(wif);
    },
    signature: (txHash: string, wif: string) => {
        return wallet.generateSignature(txHash, WALLET.wif2priv(wif));
    },
    generate: () => {
        return wallet.generatePrivateKey();
    },
    checkWIF: (wif: string) => {
        return wallet.isWIF(wif);
    },
    checkAddress: (address: string) => {
        return wallet.isAddress(address);
    }
};

export const NEP2 = {
    encode: (addr: string, wif: string, scrypt: string) => {
        const addressHash = SHA256(SHA256(latin1Encoding.parse(addr))).toString().slice(0, 8);
        const derived1 = scrypt.slice(0, 64);
        const derived2 = scrypt.slice(64);
        const xor = HEX.xor(WALLET.wif2priv(wif), derived1);
        const encrypted = CAES.encrypt(
            hexEncoding.parse(xor),
            hexEncoding.parse(derived2),
            { mode: ECBMode, padding: NoPadding }
        );
        const assembled = '0142' + 'e0' + addressHash + encrypted.ciphertext.toString();
        const encryptedKey = bs58check.encode(Buffer.from(assembled, 'hex'));
        return encryptedKey;
    },
    decode: (scrypt: string, key: string) => {
        const assembled = HEX.fromBuffer(bs58check.decode(key));
        const addressHash = assembled.substr(6, 8);
        const encrypted = assembled.substr(-64);
        const derived1 = scrypt.slice(0, 64);
        const derived2 = scrypt.slice(64);
        const ciphertext = { ciphertext: hexEncoding.parse(encrypted), salt: '' };
        const decrypted = CAES.decrypt(ciphertext, hexEncoding.parse(derived2), { mode: ECBMode, padding: NoPadding });
        const privateKey = u.hexXor(decrypted.toString(), derived1);
        const wif = WALLET.priv2wif(privateKey);
        const addr = WALLET.wif2addr(wif);
        const gotAH = SHA256(SHA256(latin1Encoding.parse(addr))).toString().slice(0, 8);
        if (addressHash === gotAH) {
            return wif;
        } else {
            return false;
        }
    }
};

export const SmartContract = {
    create: (scriptHash: string, operation: string, args: any[]) => {
        return sc.createScript({scriptHash, operation, args});
    },
    amount: (amount: number) => {
        return sc.ContractParam.byteArray(new u.Fixed8(amount), 'fixed8');
    }
};
