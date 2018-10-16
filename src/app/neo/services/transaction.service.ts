import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GlobalService, HttpService } from '../../core';
import { Transaction, UTXO } from '../models/transaction';
import { sc, wallet, u } from '@cityofzion/neon-js';
// import { WALLET, HEX, SmartContract } from '../utils';

@Injectable()
export class TransactionService {
    private usedUTXO: UTXO[] = [];
    private unconfirmedUTXO: UTXO[] = [];

    constructor(
        private http: HttpService,
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
            return Observable.throw(99984);
        }
        if (asset.length === 42 || asset.length === 66) {
            asset = asset.slice(2);
        }
        let newTX: Transaction;
        if (isNEP5) {
            newTX = Transaction.forNEP5Contract(sc.createScript({
                scriptHash: asset,
                operation: 'transfer',
                args: [
                    u.reverseHex(wallet.getScriptHashFromAddress(from)),
                    u.reverseHex(wallet.getScriptHashFromAddress(to)),
                    sc.ContractParam.byteArray(new u.Fixed8(amount), 'fixed8')
                ]
            }), wallet.getScriptHashFromAddress(from));
            return this.signNSendTX(newTX, wif, remark).pipe(map((rs) => {
                return {txid: newTX.hash, value: amount};
            }));
        }
        return this.getUTXO(from, asset)
        .pipe(switchMap((utxos) => {
            newTX = Transaction.forContract(utxos, from, to, amount, asset);
            return this.signNSendTX(newTX, wif);
        }), map(() => {
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
        }));
    }

    /**
     * Claim GAS for address
     * @param wif who will claim
     */
    public ClaimGAS(claim: any, wif: string): Observable<any> {
        const tx = Transaction.forClaim(claim.claims, claim.unSpentClaim, claim.address);
        return this.signNSendTX(tx, wif).pipe(map(() => {
            this.unconfirmedUTXO.push({
                hash: tx.hash,
                value: tx.vout[0].value,
                index: 0,
                asset: tx.vout[0].asset
            });
            return {txid: tx.hash, value: claim.unSpentClaim};
        }));
    }

    /**
     * Get unspent UTXO from api
     */
    private getUTXO(addr: string, asset: string): Observable<UTXO[]> {
        if (asset.length === 64) {
            asset = '0x' + asset;
        }
        return this.http.postGo('getutxoes', [addr, asset]).pipe(map((res: any) => {
            res = res || [];
            return (res as any[]).map((tx) => new UTXO(tx));
        }), map((utxos: UTXO[]) => {
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
        }));
    }

    /**
     * Sign the transaction and send to RPC
     * Will move to RPCService soon.
     */
    private signNSendTX(tx: Transaction, wif: string, remark?: string): Observable<any> {
        const privKey = wallet.generateSignature(tx.serielize(), wallet.getPrivateKeyFromWIF(wif));
        const invocationScript = '40' + privKey;
        const verificationScript =  '21' + wallet.getPublicKeyFromPrivateKey(privKey) + 'ac';
        tx.scripts.push({ invocationScript, verificationScript });
        if (remark) {
            tx.addRemark(remark);
        }
        return this.http.post('sendv4rawtransaction', [tx.serielize(true)]).pipe(map((rs) => {
            if (rs === true) {
                return rs;
            } else {
                throw rs;
            }
        }));
    }
}
