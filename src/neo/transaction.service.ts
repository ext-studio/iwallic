import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../core';
import { api } from '.';

@Injectable()
export class TransactionService {

    constructor() { }

    /**
     * Send asset/token to target address
     * @param target target address
     * @param amount send amount
     * @param wif wif of sender
     * @param asset assetID or scripthash
     * @param isNEP5 is NEP-5 token or not
     */
    public Send(target: string, amount: number, wif: string, asset: string, isNEP5: boolean = false): Observable<any> {
        // if asset
        //  prepare tx can be spent
        //  generate inputs
        //  generate outputs
        //  sign
        // if NEP-5
        //  just push scripts
        //  sign
        return Observable.throw('completing');
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
