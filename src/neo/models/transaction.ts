import { api, rpc, u, wallet, tx as ntx } from '@cityofzion/neon-js';

export const TxVersion = {
    'CLAIM': 0,
    'CONTRACT': 0,
    'INVOCATION': 1
};

export const TxType = {
    'CLAIM': 2,
    'CONTRACT': 128,
    'INVOCATION': 209
};

export class Input {
    public prevIndex: number;
    public prevHash: string;
}

export class Output {
    public asset: string;
    public scriptHash: string;
    public value: number;
}

export class Script {
    public invocation: string;
    public verification: string;
}

export class Transaction {
    constructor(data?: any) {
        data = data || {};
        this.type = data['type'] || TxType.CONTRACT;
        this.script = data['script'] || null;
        this.claims = data['claims'] || [];
        this.vin = data['vin'] || [];
        this.vout = data['vout'] || [];
        this.gas = data['gas'] || 0;
        this.scripts = data['scripts'] || [];
        this.version = data['version'] || TxVersion.CONTRACT;
        this.attributes = data['attributes'] || [];
    }
    public get hash(): string {
        return u.reverseHex(u.hash256(serializeTx(this, false)));
    }
    public claims: Array<{ prevHash: string, prevIndex: number }> = [];
    public type: number = TxType.CONTRACT;
    public version: number = TxVersion.CONTRACT;
    public gas: number = 0;
    public script: string = null;
    public attributes: any[] = [];
    public scripts: Script[] = [];
    public vin: Input[] = [];
    public vout: Output[] = [];
    public static deserialize(hexTx: string): Transaction {
        return new Transaction();
    }
    public static forContract(
        utxo: any[],
        target: Array<{value: number, addr: string, asset: string}>,
        wif: string
    ): Transaction {
        const vin: Input[] = [];
        const vout: Output[] = [];
        for (const tx of utxo) {
            vin.push({prevHash: tx.hash, prevIndex: tx.n});
        }
        for (const tg of target) {
            vout.push({
                scriptHash: wallet.getScriptHashFromAddress(tg.addr),
                value: tg.value,
                asset: tg.asset
            });
        }
        return new Transaction({
            vin, vout
        });
    }
    public addAttr(usage: number, data: string) {
        this.attributes.push({usage, data});
    }
}

export function serializeTx(tx: Transaction, signed: boolean): string {
    let out = '';
    out += u.num2hexstring(tx.type, 1, false);
    out += u.num2hexstring(tx.version, 1, false);
    switch (tx.type) {
        case TxType.CLAIM:
        let outClaim = u.num2VarInt(tx.claims.length);
        for (const claim of tx.claims) {
            outClaim += u.reverseHex(claim.prevHash) + u.reverseHex(u.num2hexstring(claim.prevIndex, 2));
        }
        out += outClaim;
        break;
        case TxType.INVOCATION:
        let outInvoke = u.num2VarInt(tx.script.length / 2);
        outInvoke += tx.script;
        if (tx.version >= 1) {
            outInvoke += u.num2fixed8(tx.gas);
        }
        out += outInvoke;
        break;
        case TxType.CONTRACT:
        default:
        break;
    }
    out += u.num2VarInt(tx.attributes.length);
    for (const attribute of tx.attributes) {
        if (attribute.data.length > 65535) {
            throw new Error();
        }
        let outAttr = u.num2hexstring(attribute.usage, 1, false);
        if (attribute.usage === 0x81) {
            outAttr += u.num2hexstring(attribute.data.length / 2, 1, false);
        } else if (attribute.usage === 0x90 || attribute.usage >= 0xf0) {
            outAttr += u.num2VarInt(attribute.data.length / 2);
        }
        if (attribute.usage === 0x02 || attribute.usage === 0x03) {
            outAttr += attribute.data.substr(2, 64);
        } else {
            outAttr += attribute.data;
        }
        out += outAttr;
    }
    out += u.num2VarInt(tx.vin.length);
    for (const input of tx.vin) {
        out += u.reverseHex(input.prevHash) + u.reverseHex(u.num2hexstring(input.prevIndex, 2));
    }
    out += u.num2VarInt(tx.vout.length);
    for (const output of tx.vout) {
        const value = new u.Fixed8(output.value).toReverseHex();
        out += u.reverseHex(output.asset) + value + u.reverseHex(output.scriptHash);
    }
    if (signed && tx.scripts && tx.scripts.length > 0) {
        out += u.num2VarInt(tx.scripts.length);
        for (const script of tx.scripts) {
            const invoLength = u.num2VarInt(script.invocation.length / 2);
            const veriLength = u.num2VarInt(script.verification.length / 2);
            out += invoLength + script.invocation + veriLength + script.verification;
        }
    }
    return out;
}
