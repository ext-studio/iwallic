import { Injectable, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { refCount, publish, startWith, switchMap } from 'rxjs/operators';
import { GlobalService } from '../services/global';
import { HttpService } from '../services/http';
import { Storage } from '@ionic/storage';

/**
 * for state management of assets & balances of an address
 */

@Injectable()
export class BalanceState {
    private _loading: boolean = false;
    private _balance: any[];
    private $balance: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private global: GlobalService,
        private http: HttpService,
        private storage: Storage
    ) { }
    public listen(address: string): Observable<any> {
        if (!this._balance) {
            this.fetch(address);
        }
        if (this._balance) {
            return this.$balance.pipe(publish(), refCount(), startWith(this._balance));
        }
        return this.$balance.pipe(publish(), refCount());
    }
    public error(): Observable<any> {
        return this.$error.pipe(publish(), refCount());
    }
    public fetch(address: string): Promise<any> {
        return new Promise((resolve) => {
            if (this._loading) {
                resolve(99990);
                return;
            }
            this._loading = true;
            this.http.get(`/client/index/assets/display?wallet_address=${address}`).pipe(switchMap((res: any[]) => this.getAssetChooseList(res))).subscribe((res) => {
                this._loading = false;
                this._balance = res || [];
                this.$balance.next(this._balance);
                resolve();
            }, (err) => {
                this._loading = false;
                this.$error.next(err);
                resolve();
            });
        }).catch(() => {});
    }
    public fetchSilent(address: string) {
        if (this._loading) {
            return;
        }
        this.http.get(`/client/index/assets/display?wallet_address=${address}`).pipe(switchMap((res: any[]) => this.getAssetChooseList(res))).subscribe((res) => {
            this._balance = res || [];
            this.$balance.next(this._balance);
        }, (err) => {
            this.$error.next(err);
        });
    }
    public getAssetChooseList(result: any[]): Observable <any> {
        return new Observable<any>((observer) => {
            this.storage.get(`asset_subscribe_${this.http.neoNet}`).then((res) => {
                if (res) {
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
        this._balance = undefined;
    }
}
