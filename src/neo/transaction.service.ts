import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../core';
import { api, ASSET } from '.';
import { RPCService } from './rpc.service';
import { Transaction } from './models/transaction';

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
        isNEP5: boolean = false
    ): Observable<any> {
        // if asset
        //  prepare tx can be spent
        //  generate inputs
        //  generate outputs
        //  sign
        // if NEP-5
        //  just push scripts
        //  sign
        // const tx = Transaction.forContract([], {value: amount, addr: target, asset: asset});
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
            return new Observable((observer) => {
                observer.next(Transaction.forContract(res, from, to, amount, ASSET.NEO));
            });
        });
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
