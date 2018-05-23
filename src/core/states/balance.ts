import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../services/global';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/startWith';

/**
 * for state management of assets & balances of an address
 */

@Injectable()
export class BalanceState {
    public get loading(): boolean {
        return this._loading;
    }
    private _loading: boolean = false;
    private address: string;
    private _balance: any[];
    private $balance: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private global: GlobalService,
        private http: HttpClient
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
            }).subscribe((res: any) => {
                this._loading = false;
                if (res && res.code === 200) {
                    this._balance = res.result || [];
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
        });
    }
    public fetchSilent() {
        if (this._loading || !this.address) {
            return;
        }
        this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'getaddrassets',
            params: [this.address, 1]
        }).subscribe((res: any) => {
            if (res && res.code === 200) {
                this._balance = res.result || [];
                this.$balance.next(this._balance);
            } else {
                this.$error.next(res && res.msg || 'unknown_error');
            }
        }, (err) => {
            this.$error.next('request_error');
        });
    }
    public clear() {
        this.address = undefined;
        this._balance = undefined;
    }
}
