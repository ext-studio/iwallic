import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GlobalService } from '../services/global';
import { HttpService } from '../services/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class TransactionState {
    public get loading(): boolean {
        return this._loading;
    }
    public get page(): number {
        return this._page;
    }
    public get pageSize(): number {
        return this._pageSize;
    }
    public get total(): number {
        return this._total;
    }
    public get nomore(): boolean {
        return (this.total / this.pageSize) <= this.page;
    }
    private _page: number = 1;
    private _pageSize: number = 10;
    private _total: number = 0;
    private _loading: boolean = false;
    private asset: string = null;
    private address: string = null;
    private _transaction: any[];
    private $transaction: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private global: GlobalService,
        private http: HttpService
    ) { }
    public get(address: string, asset: string = null): Observable<any> {
        this.asset = asset;
        if (
            !this._transaction ||
            (this._transaction[this._transaction.length - 1] &&
                this._transaction[this._transaction.length - 1].unconfirmed === true)
        ) {
            this.fetch(false, address);
        }
        if (this._transaction) {
            return this.$transaction.publish().refCount().startWith(this._transaction);
        }
        return this.$transaction.publish().refCount();
    }
    public error(): Observable<any> {
        return this.$error.publish().refCount();
    }
    // try fetch more (not broken pagination)
    public fetch(isNext: boolean = false, address?: string): Promise<any> {
        if (address && address !== this.address) {
            this.address = address;
        }
        return new Promise((resolve, reject) => {
            if (this._loading) {
                resolve();
                return;
            }
            if (isNext && this.total / (this.pageSize * this.page) <= 1) {
                resolve();
                return;
            }
            this._loading = true;
            // get tx of all assets
            this.request(
                isNext ? this.page + 1 : 1, this.pageSize, this.address, this.asset
            ).switchMap((rs: { data: any[], page: number, pageSize: number, total: number }) => {
                const newCount = rs.total - this._total;
                // get older tx
                if (isNext) {
                    if (newCount < 0) {
                        // less tx
                        return Observable.throw(99995);
                    } else if (newCount === 0) {
                        // no new tx
                        return Observable.of(rs);
                    } else {
                        // has new tx, count real current page
                        this._page = Math.floor(rs.total / rs.pageSize) + 1;
                        return this.request(
                            // new tx takes a whole page or not
                            newCount % this.pageSize > 0 ? this.page : this._page + 1,
                            this.pageSize, this.address, this.asset
                        );
                    }
                } else {
                    if (newCount <= 0) {
                        // less tx
                        return Observable.throw(99995);
                    }
                    if (this._total === 0 || newCount <= this._pageSize) {
                        // new tx less than page size
                        return Observable.of(rs);
                    } else {
                        // new tx over page size, need fetching those unfetched
                        return this.request(1, newCount, this.address, this.asset);
                    }
                }
            }).subscribe((rs: { data: any[], page: number, pageSize: number, total: number }) => {
                this.mergeTx(rs, isNext);
                this._loading = false;
                this.$transaction.next(this._transaction);
                resolve();
            }, (err) => {
                console.log(err);
                this._loading = false;
                if (err !== 99995) {
                    this.$error.next(err);
                }
                resolve();
            });
        }).catch(() => {});
    }
    public fetchSilent() {
        if (this.loading || !this.address) {
            return;
        }
        this.request(
            1, this.pageSize, this.address, this.asset
        ).switchMap((rs: { data: any[], page: number, pageSize: number, total: number }) => {
            const newCount = rs.total - this._total;
            if (newCount <= 0) {
                // less tx
                return Observable.throw(99995);
            }
            if (this._total === 0 || newCount <= this._pageSize) {
                // new tx less than page size
                return Observable.of(rs);
            } else {
                // new tx over page size, need fetching those unfetched
                return this.request(1, newCount, this.address, this.asset);
            }
        }).subscribe((rs: { data: any[], page: number, pageSize: number, total: number }) => {
            this.mergeTx(rs);
            this.$transaction.next(this._transaction);
        }, (err) => {
            if (err === 99995) {
                return;
            }
            this.$error.next(err);
        });
    }
    public clear() {
        this._transaction = undefined;
        this.address = undefined;
    }
    private request(page: number, pageSize: number, address: string, asset: string): Observable<any> {
        if (asset) {
            return this.http.post(this.global.apiDomain + '/api/iwallic', {
                method: 'getassettxes',
                params: [page, pageSize, address, asset]
            });
        }
        return this.http.post(this.global.apiDomain + '/api/iwallic', {
            method: 'getaccounttxes',
            params: [page, pageSize, address]
        });
    }
    // unshift or concact tx
    private mergeTx(rs: { data: any[], page: number, pageSize: number, total: number }, isOlder: boolean = false) {
        this._total = rs.total;
        rs.data = rs.data || [];
        if (!this._transaction || !this._transaction.length) {
            this._transaction = rs.data;
            this._page = rs.page;
            return;
        }
        if (isOlder) {
            this._transaction = this._transaction.concat(rs.data);
            this._page = rs.page;
        } else {
            for (let i = rs.data.length - 1; i >= 0; i--) {
                const index = this._transaction.findIndex((tx) => rs.data[i] && tx.txid === rs.data[i].txid);
                if (index < 0) {
                    this._transaction.unshift(rs.data[i]);
                }
            }
        }
    }
}
