import { Injectable, } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../services/global';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NetService } from '../services/net';
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
        private http: HttpClient,
        private storage: Storage,
        private net: NetService
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
                reject('loading');
                return;
            }
            this._loading = true;
            this.http.post(`${this.global.apiDomain}/api/iwallic`, {
                method: 'getaddrassets',
                params: [this.address, 1]
            }).switchMap((res: any) => {
                if (res && res.code === 200) {
                    return this.getAssetChooseList(res.result);
                } else {
                    return Observable.of(false);
                }
            }).subscribe((res: any) => {
                this._loading = false;
                if (res) {
                    this._balance = res || [];
                    this.$balance.next(this._balance);
                } else {
                    this.$error.next(res && res.msg || 'unknown_error');
                }
                resolve();
            }, (err) => {
                this._loading = false;
                this.$error.next('request_error');
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
        }).switchMap((res: any) => {
            if (res && res.code === 200) {
                return this.getAssetChooseList(res.result);
            } else {
                return Observable.of(false);
            }
        }).subscribe((res: any) => {
            if (res) {
                this._balance = res || [];
                this.$balance.next(this._balance);
            } else {
                this.$error.next(res && res.msg || 'unknown_error');
            }
        }, (err) => {
            this.$error.next('request_error');
        });
    }
    public getAssetChooseList(result: any[]): Observable <any> {
        return new Observable<any>((observer) => {
            this.storage.get('MainAssetList').then((res) => {
                if (res && `${this.net.current}` === 'Main') {
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
                        } else {
                            if (result.findIndex((e) => e.assetId === i.assetId) >= 0) {
                                const arrayIndex = result.findIndex((e) => e.assetId === i.assetId);
                                result.splice(arrayIndex, 1);
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
