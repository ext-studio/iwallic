import { Injectable, } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../services/global';
import { HttpService } from '../services/http';
import { Storage } from '@ionic/storage';
import { ConfigService } from '../services/config';
import 'rxjs/add/operator/startWith';

/**
 * for state management of assets & balances of an address
 */

@Injectable()
export class BalanceState {
    public get loading(): boolean {
        return this._loading;
    }
    public unconfirmedClaim: string;
    private _loading: boolean = false;
    private address: string;
    private _balance: any[];
    private $balance: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private global: GlobalService,
        private http: HttpService,
        private storage: Storage,
        private config: ConfigService
    ) { }
    public get(address?: string): Observable<any> {
        if (address && this.address !== address) {
            this.address = address;
            this.fetch(this.address);
        } else if (!this._balance) {
            this.fetch(address || this.address);
        }
        if (this._balance) {
            return this.$balance.publish().refCount().startWith(this._balance);
        }
        return this.$balance.publish().refCount();
    }
    public error(): Observable<any> {
        return this.$error.publish().refCount();
    }
    public fetch(address?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (address) {
                this.address = address;
            } else if (this._loading) {
                reject(99990);
                return;
            }
            this._loading = true;
            this.http.post(`${this.global.apiDomain}/api/iwallic`, {
                method: 'getaddrassets',
                params: [this.address, 1]
            }).switchMap((res: any) =>  this.getAssetChooseList(res)).subscribe((res: any) => {
                this._loading = false;
                this._balance = res || [];
                this.$balance.next(this._balance);
                resolve();
            }, (err) => {
                this._loading = false;
                if (!this.config.online) {
                    resolve();
                    return;
                }
                this.$error.next(err);
                resolve();
            });
        }).catch(() => {});
    }
    public fetchSilent() {
        if (this._loading || !this.address) {
            return;
        }
        this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'getaddrassets',
            params: [this.address, 1]
        }).switchMap((res: any) => this.getAssetChooseList(res)).subscribe((res: any) => {
            this._balance = res || [];
            this.$balance.next(this._balance);
        }, (err) => {
            this.$error.next(err);
        });
    }
    public getAssetChooseList(result: any[]): Observable <any> {
        return new Observable<any>((observer) => {
            this.storage.get('MainAssetList').then((res) => {
                if (res && `${this.config.current}` === 'main') {
                    for (const i of res) {
                        if (i.choose) {
                            if (result.findIndex((e) => e.assetId === i.assetId) < 0) {
                                result.push({
                                    'symbol': i.symbol,
                                    'name': i.name,
                                    'assetId': i.assetId,
                                    'balance': 0
                                });
                            } else {
                                continue;
                            }
                        }
                    }
                    observer.next(result);
                    observer.complete();
                } else {
                    observer.next(result);
                    observer.complete();
                }
            });
        });
    }
    public clear() {
        this.address = undefined;
        this._balance = undefined;
    }
}
