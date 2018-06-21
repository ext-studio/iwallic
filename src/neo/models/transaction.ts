import { ASSET, WALLET, HEX } from '../utils';

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
    public get hash(): string {
        return HEX.reverse(HEX.hash256(this.serielize()));
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
    constructor(data?: any) {
        data = data || {};
        this.type = data['type'] || this.type;
        this.script = data['script'] || null;
        this.claims = data['claims'] || [];
        this.vin = data['vin'] || [];
        this.vout = data['vout'] || [];
        this.gas = data['gas'] || 0;
        this.scripts = data['scripts'] || [];
        this.version = data['version'] || TxVersion.CONTRACT;
        this.attributes = data['attributes'] || [];
    }
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
            scriptHash: WALLET.addr2hash(to)
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
            throw 99988;
        }
        if (payback > 0) {
            vout.push({value: payback, asset: asset, scriptHash: WALLET.addr2hash(from)});
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
    public static forClaim(claims: any[], value: number, to: string): Transaction {
        return new Transaction({
            type: TxType.CLAIM,
            claims: claims.map((c) => ({prevHash: c.txid, prevIndex: c.index})),
            vout: [{
                asset: ASSET.GAS,
                value: value,
                scriptHash: WALLET.addr2hash(to)
            }]
        });
    }
    public addRemark(data: string) {
        // usage Remark
        // data string
        this.attributes.push({usage: AttributeUsage.REMARK, data: HEX.fromString(data)});
    }
    public addNEP5(data: string) {
        this.attributes.push({usage: AttributeUsage.SCRIPT, data: HEX.reverse(data)});
        this.attributes.push({
            usage: AttributeUsage.NEP5,
            data: HEX.reverse(HEX.fromString('from iwallic at ' + new Date().getTime()))
        });
    }
    public serielize(signed: boolean = false): string {
        let out = '';
        out += HEX.fromNumber(this.type, 1, false);
        out += HEX.fromNumber(this.version, 1, false);
        out += this.serielizeType();
        out += this.serielizeAttr();
        out += this.serielizeInput();
        out += this.serielizeOutput();
        if (signed && this.scripts && this.scripts.length > 0) {
            out += HEX.forNum(this.scripts.length);
            for (const script of this.scripts) {
                const invoLength = HEX.forNum(script.invocationScript.length / 2);
                const veriLength = HEX.forNum(script.verificationScript.length / 2);
                out += invoLength + script.invocationScript + veriLength + script.verificationScript;
            }
        }
        return out;
    }
    private serielizeType(): string {
        switch (this.type) {
            case TxType.CLAIM:
            let outClaim = HEX.forNum(this.claims.length);
            for (const claim of this.claims) {
                if (typeof claim.prevIndex === 'string') {
                    claim.prevIndex = parseInt(claim.prevIndex, 0);
                }
                if (claim.prevHash.length === 66) {
                    claim.prevHash = claim.prevHash.slice(2);
                }
                outClaim += HEX.reverse(claim.prevHash) + HEX.reverse(HEX.fromNumber(claim.prevIndex, 2));
            }
            return outClaim;
            case TxType.INVOCATION:
            let outInvoke = HEX.forNum(this.script.length / 2);
            outInvoke += this.script;
            if (this.version >= 1) {
                outInvoke += HEX.forFixedNum(this.gas);
            }
            return outInvoke;
            case TxType.CONTRACT:
            default:
            return '';
        }
    }
    private serielizeAttr(): string {
        let rs = HEX.forNum(this.attributes.length);
        for (const attribute of this.attributes) {
            if (attribute.data.length > 65535) {
                throw new Error();
            }
            rs += HEX.fromNumber(attribute.usage, 1, false);
            if (attribute.usage === 0x81) {
                rs += HEX.fromNumber(attribute.data.length / 2, 1, false);
            } else if (attribute.usage === 0x90 || attribute.usage >= 0xf0) {
                rs += HEX.forNum(attribute.data.length / 2);
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
        let rs = HEX.forNum(this.vin.length);
        for (const input of this.vin) {
            rs += HEX.reverse(input.prevHash) + HEX.reverse(HEX.fromNumber(input.prevIndex, 2));
        }
        return rs;
    }
    private serielizeOutput(): string {
        let rs = HEX.forNum(this.vout.length);
        for (const output of this.vout) {
            const value = HEX.forFixedNum(typeof output.value === 'string' ? parseInt(output.value, 0) : output.value);
            if (output.asset.length === 66) {
                output.asset = output.asset.slice(2);
            }
            rs += HEX.reverse(output.asset) + value + HEX.reverse(output.scriptHash);
        }
        return rs;
    }
}
