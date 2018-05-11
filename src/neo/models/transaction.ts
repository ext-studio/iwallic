import { api, rpc, u, wallet, tx as ntx, sc } from '@cityofzion/neon-js';

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

export const AttributeUsage = {
    SCRIPT: 0X20,
    REMARK: 0xf0,
    NEP5: 0xf1
};

export class UTXO {
    public index: number;
    public hash: string;
    public value: number;
    public asset: string;
    constructor(
        data: any
    ) {
        this.index = data['n'];
        this.asset = data['assetId'];
        if (this.asset && this.asset.length === 66) {
            this.asset = this.asset.slice(2);
        }
        this.hash = data['txid'];
        if (this.hash && this.hash.length === 66) {
            this.hash = this.hash.slice(2);
        }
        this.value = parseFloat(data['value']);
    }
}

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
    public invocationScript: string;
    public verificationScript: string;
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
        return u.reverseHex(u.hash256(this.serielize()));
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
        utxo: UTXO[],
        from: string,
        to: string,
        amount: number,
        asset: string
    ): Transaction {
        const vin: Input[] = [];
        const vout: Output[] = [{
            asset: asset,
            value: amount,
            scriptHash: wallet.getScriptHashFromAddress(to)
        }];
        let curr = 0;
        for (const tx of utxo) {
            curr += tx.value;
            vin.push({prevIndex: tx.index, prevHash: tx.hash});
            if (curr >= amount) {
                break;
            }
        }
        const payback = curr - amount;
        if (payback < 0) {
            throw 'not_enouogh';
        }
        if (payback > 0) {
            vout.push({value: payback, asset: asset, scriptHash: wallet.getScriptHashFromAddress(from)});
        }
        return new Transaction({
            vin, vout
        });
    }
    public static forNEP5Contract(
        script: string,
        from: string
    ): Transaction {
        script = script + 'f1';
        const tx = new Transaction({
            script: script,
            type: TxType.INVOCATION,
            version: TxVersion.INVOCATION
        });
        tx.addNEP5(from);
        return tx;
    }
    public addRemark(data: string) {
        // usage Remark
        // data string
        this.attributes.push({usage: AttributeUsage.REMARK, data: u.str2hexstring(data)});
    }
    public addNEP5(data: string) {
        this.attributes.push({usage: AttributeUsage.SCRIPT, data: u.reverseHex(data)});
        this.attributes.push({
            usage: AttributeUsage.NEP5,
            data: u.reverseHex(u.str2hexstring('from iwallic' + new Date().getTime()))
        });
    }
    public serielize(signed: boolean = false): string {
        let out = '';
        out += u.num2hexstring(this.type, 1, false);
        out += u.num2hexstring(this.version, 1, false);
        out += this.serielizeType();
        out += this.serielizeAttr();
        out += this.serielizeInput();
        out += this.serielizeOutput();
        if (signed && this.scripts && this.scripts.length > 0) {
            out += u.num2VarInt(this.scripts.length);
            for (const script of this.scripts) {
                const invoLength = u.num2VarInt(script.invocationScript.length / 2);
                const veriLength = u.num2VarInt(script.verificationScript.length / 2);
                out += invoLength + script.invocationScript + veriLength + script.verificationScript;
            }
        }
        return out;
    }
    private serielizeType(): string {
        switch (this.type) {
            case TxType.CLAIM:
            let outClaim = u.num2VarInt(this.claims.length);
            for (const claim of this.claims) {
                outClaim += u.reverseHex(claim.prevHash) + u.reverseHex(u.num2hexstring(claim.prevIndex, 2));
            }
            return outClaim;
            case TxType.INVOCATION:
            let outInvoke = u.num2VarInt(this.script.length / 2);
            outInvoke += this.script;
            if (this.version >= 1) {
                outInvoke += u.num2fixed8(this.gas);
            }
            return outInvoke;
            case TxType.CONTRACT:
            default:
            return '';
        }
    }
    private serielizeAttr(): string {
        let rs = u.num2VarInt(this.attributes.length);
        for (const attribute of this.attributes) {
            if (attribute.data.length > 65535) {
                throw new Error();
            }
            rs += u.num2hexstring(attribute.usage, 1, false);
            if (attribute.usage === 0x81) {
                rs += u.num2hexstring(attribute.data.length / 2, 1, false);
            } else if (attribute.usage === 0x90 || attribute.usage >= 0xf0) {
                rs += u.num2VarInt(attribute.data.length / 2);
            }
            if (attribute.usage === 0x02 || attribute.usage === 0x03) {
                rs += attribute.data.substr(2, 64);
            } else {
                rs += attribute.data;
            }
        }
        return rs;
    }
    private serielizeInput(): string {
        let rs = u.num2VarInt(this.vin.length);
        for (const input of this.vin) {
            rs += u.reverseHex(input.prevHash) + u.reverseHex(u.num2hexstring(input.prevIndex, 2));
        }
        return rs;
    }
    private serielizeOutput(): string {
        let rs = u.num2VarInt(this.vout.length);
        for (const output of this.vout) {
            const value = new u.Fixed8(output.value).toReverseHex();
            rs += u.reverseHex(output.asset) + value + u.reverseHex(output.scriptHash);
        }
        return rs;
    }
}
