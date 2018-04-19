import { Injectable } from '@angular/core';
import { wallet, UtilService } from '.';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class WalletService {

    constructor(
        private util: UtilService
    ) {}
    /**
     * generate new private key by neon-js
     * inner implements is ``window.crypto.getRandomValues()``
     */
    public Create(): Observable<string> {
        return Observable.of(wallet.generatePrivateKey());
    }
}
