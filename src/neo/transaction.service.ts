import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
}
