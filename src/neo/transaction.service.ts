import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../core';
import { api, wallet, u, sc } from '.';
import { Transaction, TxType, UTXO } from './models/transaction';

@Injectable()
export class TransactionService {
    private usedUTXO: UTXO[] = [];
    private unconfirmedUTXO: UTXO[] = [];

    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) { }

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
            return this.signNSendTX(newTX, wif, remark);
        }
        return this.getUTXO(from, asset)
            .switchMap((utxos) => {
                newTX = Transaction.forContract(utxos, from, to, amount, asset);
                return this.signNSendTX(newTX, wif);
            }).map((rs) => {
                if (rs && rs.result) {
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
                }
                return rs;
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
            if (res.code === 200) {
                res.result = res.result || [];
                return (res.result as any[]).map((tx) => new UTXO(tx));
            } else {
                throw res.message;
            }
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
        const invocationScript = '40' +
            wallet.generateSignature(tx.serielize(), wallet.getPrivateKeyFromWIF(wif));
        const verificationScript =  '21' + wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif)) + 'ac';
        tx.scripts.push({ invocationScript, verificationScript });
        if (remark) {
            tx.addRemark(remark);
        }
        return this.http.post(`${this.global.rpcDomain}`, {
            jsonrpc: '2.0',
            method: 'sendrawtransaction',
            params: [tx.serielize(true)],
            id: 1
        });
    }

    /**
     * Claim GAS for address
     * @param wif who will claim
     */
    public ClaimGAS(wif: string): Observable<any> {
        return Observable.throw('completing');
    }

    // public Transfer(
    //     from: string,
    //     wif: string,
    //     target: string,
    //     amount: number,
    //     asset: string,
    //     assetName: string
    // ): Observable<any> {
    //     if (asset.length > 40) {
    //         return this.assetTransfer(from, wif, target, amount, asset, assetName);
    //     } else {
    //         return this.assetTransfer(from, wif, target, amount, asset, assetName);
    //     }
    // }

    // private nep5Transfer(
    //     from: string,
    //     wif: string,
    //     target: string,
    //     amount: number,
    //     asset: string
    // ): Observable<any> {
    //     return new Observable((observer) => {
    //         api.nep5.doTransferToken(
    //             'TestNet',
    //             asset,
    //             wif,
    //             target,
    //             amount * 100000000,
    //             0,
    //             null
    //         ).then(res => {
    //             observer.next(true);
    //             observer.complete();
    //         }).catch(err => {
    //             return Observable.throw(false);
    //         });
    //     });
    // }

    // private assetTransfer(
    //     from: string,
    //     wif: string,
    //     target: string,
    //     amount: number,
    //     asset: string,
    //     assetName: string
    // ): Observable<any> {
    //     return new Observable((observer) => {
    //         const intent = api.makeIntent({ [assetName]: amount }, target);
    //         const config = {
    //             net: 'TestNet',
    //             address: from,
    //             privateKey: wif,
    //             intents: intent
    //         };
    //         api.sendAsset(config).then(res => {
    //             observer.next(true);
    //             observer.complete();
    //         }).catch(res => {
    //             return Observable.throw(false);
    //         });
    //     });
    // }
}
