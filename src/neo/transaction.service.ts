import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../core';
import { api, ASSET, tx as neonTX, wallet, u, sc } from '.';
import { RPCService } from './rpc.service';
import { Transaction, TxType, serializeTx } from './models/transaction';
import { ec as EC } from 'elliptic';

@Injectable()
export class TransactionService {

    constructor(
        private http: HttpClient,
        // private global: GlobalService,
        private rpc: RPCService
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
        if (isNEP5) {
            const newTX = Transaction.forNEP5Contract(sc.createScript({
                scriptHash: asset.slice(2),
                operation: 'transfer',
                args: [
                    u.reverseHex(wallet.getScriptHashFromAddress(from)),
                    u.reverseHex(wallet.getScriptHashFromAddress(to)),
                    sc.ContractParam.byteArray(new u.Fixed8(amount), 'fixed8')
                ]
            }), wallet.getScriptHashFromAddress(from));
            const invocationScript = '40' +
                wallet.generateSignature(this.serializeTx(newTX, false), wallet.getPrivateKeyFromWIF(wif));
            const verificationScript =  '21' + wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif)) + 'ac';
            newTX.scripts.push({ invocationScript, verificationScript });
            if (remark) {
                newTX.addRemark(remark);
            }
            console.log(newTX);
            return this.http.post(`${this.rpc.rpcUrl}`, {
                jsonrpc: '2.0',
                method: 'sendrawtransaction',
                params: [this.serializeTx(newTX, true)],
                id: 1
            });
        }
        return this.http.post(
            `${this.rpc.apiUrl}/api/iwallic`,
            {
                method: 'getutxoes',
                params: [from, 'NEO']
            }
        ).map((res: any) => {
            if (res.code === 200) {
                return res.result;
            } else {
                throw res.message;
            }
        }).switchMap((res) => {
            const newTX = Transaction.forContract(res, from, to, amount, ASSET.NEO);
            if (remark) {
                newTX.addRemark(remark);
            }
            const invocationScript = '40' +
                wallet.generateSignature(this.serializeTx(newTX, false), wallet.getPrivateKeyFromWIF(wif));
            const verificationScript =  '21' + wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(wif)) + 'ac';
            newTX.scripts.push({ invocationScript, verificationScript });
            return this.http.post(`${this.rpc.rpcUrl}`, {
                jsonrpc: '2.0',
                method: 'sendrawtransaction',
                params: [this.serializeTx(newTX, true)],
                id: 1
            });
        });
    }

    public serializeTx(tx: Transaction, signed: boolean = false) {
        return serializeTx(tx, signed);
    }

    private generateSignature (tx, privateKey) {
        // const msgHash = u.sha256(tx);
        // const msgHashHex = Buffer.from(msgHash, 'hex');
        // let elliptic = new EC('p256');
        // const sig = elliptic.sign(msgHashHex, privateKey, null);
        // const signature = Buffer.concat([
        //   sig.r.toArrayLike(Buffer, 'be', 32),
        //   sig.s.toArrayLike(Buffer, 'be', 32)
        // ]);
        // return signature.toString('hex');
      }

    /**
     * Claim GAS for address
     * @param wif who will claim
     */
    public ClaimGAS(wif: string): Observable<any> {
        return Observable.throw('completing');
    }

    public Transfer(
        from: string,
        wif: string,
        target: string,
        amount: number,
        asset: string,
        assetName: string
    ): Observable<any> {
        if (asset.length > 40) {
            return this.assetTransfer(from, wif, target, amount, asset, assetName);
        } else {
            return this.assetTransfer(from, wif, target, amount, asset, assetName);
        }
    }

    private nep5Transfer(
        from: string,
        wif: string,
        target: string,
        amount: number,
        asset: string
    ): Observable<any> {
        return new Observable((observer) => {
            api.nep5.doTransferToken(
                'TestNet',
                asset,
                wif,
                target,
                amount * 100000000,
                0,
                null
            ).then(res => {
                observer.next(true);
                observer.complete();
            }).catch(err => {
                return Observable.throw(false);
            });
        });
    }

    private assetTransfer(
        from: string,
        wif: string,
        target: string,
        amount: number,
        asset: string,
        assetName: string
    ): Observable<any> {
        return new Observable((observer) => {
            const intent = api.makeIntent({ [assetName]: amount }, target);
            const config = {
                net: 'TestNet',
                address: from,
                privateKey: wif,
                intents: intent
            };
            api.sendAsset(config).then(res => {
                observer.next(true);
                observer.complete();
            }).catch(res => {
                return Observable.throw(false);
            });
        });

    }
}
