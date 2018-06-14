import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core';
import { Transaction, UTXO } from '../models/transaction';
import { WALLET, HEX, SmartContract } from '../utils';

@Injectable()
export class TransactionService {
    private usedUTXO: UTXO[] = [];
    private unconfirmedUTXO: UTXO[] = [];

    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) {
        //
    }

    /**
     * Send asset/token to target address
     * @param target target address
     * @param amount send amount
     * @param wif wif of sender
     * @param asset assetID or scripthash
     * @param isNEP5 is NEP-5 token or not
     */
    public Send(
        from: string,
        to: string,
        amount: number,
        wif: string,
        asset: string,
        isNEP5: boolean = false,
        remark?: string
    ): Observable<any> {
        if (amount <= 0) {
            return Observable.throw('invalid_amount');
        }
        if (asset.length === 42 || asset.length === 66) {
            asset = asset.slice(2);
        }
        let newTX: Transaction;
        if (isNEP5) {
            newTX = Transaction.forNEP5Contract(SmartContract.create(
                asset,
                'transfer',
                [
                    HEX.reverse(WALLET.addr2hash(from)),
                    HEX.reverse(WALLET.addr2hash(to)),
                    SmartContract.amount(amount)
                ]
            ), WALLET.addr2hash(from));
            return this.signNSendTX(newTX, wif, remark).map((rs) => {
                return {txid: newTX.hash, value: amount};
            });
        }
        return this.getUTXO(from, asset)
            .switchMap((utxos) => {
                newTX = Transaction.forContract(utxos, from, to, amount, asset);
                return this.signNSendTX(newTX, wif);
            }).map(() => {
                for (let i = 0; i < newTX.vout.length; i++) {
                    this.unconfirmedUTXO.push({
                        hash: newTX.hash,
                        value: newTX.vout[i].value,
                        index: i,
                        asset: newTX.vout[i].asset
                    });
                }
                for (const tx of newTX.vin) {
                    this.usedUTXO.push({hash: tx.prevHash, index: tx.prevIndex, asset: asset, value: 0});
                }
                return {txid: newTX.hash, value: amount};
            });
    }

    /**
     * Claim GAS for address
     * @param wif who will claim
     */
    public ClaimGAS(claim: any, wif: string): Observable<any> {
        const tx = Transaction.forClaim(claim.claims, claim.unSpentClaim, claim.address);
        return this.signNSendTX(tx, wif).map((res) => {
            this.unconfirmedUTXO.push({
                hash: tx.hash,
                value: tx.vout[0].value,
                index: 0,
                asset: tx.vout[0].asset
            });
            return {txid: tx.hash, value: claim.unSpentClaim};
        });
    }

    /**
     * Get unspent UTXO from api
     */
    private getUTXO(addr: string, asset: string): Observable<UTXO[]> {
        if (asset.length === 64) {
            asset = '0x' + asset;
        }
        return this.http.post(
            `${this.global.apiDomain}/api/iwallic`,
            {
                method: 'getutxoes',
                params: [addr, asset]
            }
        ).map((res: any) => {
            res = res || [];
            return (res as any[]).map((tx) => new UTXO(tx));
        }).map((utxos: UTXO[]) => {
            for (let i = 0; i < this.usedUTXO.length; i++) {
                const index = utxos.findIndex((e) => e.hash === this.usedUTXO[i].hash && e.index === this.usedUTXO[i].index);
                if (index >= 0) {
                    utxos.splice(index, 1);
                } else {
                    this.usedUTXO.splice(i, 1);
                }
            }
            for (const tx of this.unconfirmedUTXO) {
                const index = utxos.findIndex((e) => e.hash === tx.hash && e.index === tx.index);
                if (index >= 0) {
                    this.unconfirmedUTXO.splice(index, 1);
                }
            }
            return utxos;
        });
    }

    /**
     * Sign the transaction and send to RPC
     * Will move to RPCService soon.
     */
    private signNSendTX(tx: Transaction, wif: string, remark?: string): Observable<any> {
        const invocationScript = '40' + WALLET.signature(tx.serielize(), wif);
        const verificationScript =  '21' + WALLET.priv2pub(WALLET.wif2priv(wif)) + 'ac';
        tx.scripts.push({ invocationScript, verificationScript });
        if (remark) {
            tx.addRemark(remark);
        }
        return this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'sendv4rawtransaction',
            params: [tx.serielize(true)],
        });
    }
}
