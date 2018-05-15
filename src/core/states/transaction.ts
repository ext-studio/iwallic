import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GlobalService } from '../services/global';
import { HttpClient } from '@angular/common/http';
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
    public get unconfirmed(): any[] {
        return this._unconfirmed;
    }
    public get nomore(): boolean {
        return (this.total / this.pageSize) < this.page;
    }
    private _unconfirmed: any[] = [];
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
        private http: HttpClient
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
                        return Observable.throw('no_need');
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
                        return Observable.throw('no_need');
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
                if (err !== 'no_need') {
                    this.$error.next(typeof err === 'string' ? err : 'request_error');
                }
                resolve();
            });
        });
    }
    public fetchSilent() {
        if (this.loading || !this.address) {
            return;
        }
        // get tx of all assets
        if (!this.asset) {
            this.request(
                1, this.pageSize, this.address, this.asset
            ).switchMap((rs: { data: any[], page: number, pageSize: number, total: number }) => {
                const newCount = rs.total - this._total;
                if (newCount <= 0) {
                    // less tx
                    return Observable.throw('no_need');
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
                if (err === 'no_need') {
                    return;
                }
                this.$error.next(typeof err === 'string' ? err : 'request_error');
            });
        } else {
            this.$error.next('completing');
        }
    }
    // push unconfirmed tx into list
    public push(name: string, txid: string, value: number) {
        this._transaction = this._transaction || [];
        if (txid.length === 64) {
            txid = '0x' + txid;
        }
        this._transaction.unshift({ name: name, txid: txid, value: '-' + value.toString(), unconfirmed: true });
        this.$transaction.next(this._transaction);
    }
    private request(page: number, pageSize: number, address: string, asset: string): Observable<any> {
        if (asset) {
            return this.http.post(this.global.apiDomain + '/api/iwallic', {
                method: 'getassettxes',
                params: [page, pageSize, address, asset]
            }).map((res: any) => {
                if (res && res.code === 200) {
                    return res.result;
                } else {
                    throw res && res.msg || 'unknown_error';
                }
            });
            // return Observable.throw('completing');
        }
        return this.http.post(this.global.apiDomain + '/api/iwallic', {
            method: 'getaccounttxes',
            params: [page, pageSize, address]
        }).map((res: any) => {
            if (res && res.code === 200) {
                return res.result;
            } else {
                throw res && res.msg || 'unknown_error';
            }
        });
    }
    // unshift or concact tx
    // replace unfonfirmed tx if matched
    private mergeTx(rs: { data: any[], page: number, pageSize: number, total: number }, isOlder: boolean = false) {
        this._total = rs.total;
        if (!this._transaction || !this._transaction.length) {
            this._transaction = rs.data;
            this._page = rs.page;
            return;
        }
        if (isOlder) {
            for (let i = 0; i < rs.data.length; i++) {
                const index = this._transaction.findIndex((tx) => rs.data[i] && tx.txid === rs.data[i].txid && tx.unconfirmed);
                if (index >= 0) {
                    this._transaction.splice(index, 1);
                }
                this._transaction.push(rs.data[i]);
            }
            this._page = rs.page;
        } else {
            for (let i = rs.data.length - 1; i >= 0; i--) {
                const index = this._transaction.findIndex((tx) => rs.data[i] && tx.txid === rs.data[i].txid);
                if (index >= 0) {
                    if (this._transaction[index].unconfirmed) {
                        this._transaction.splice(index, 1, rs.data[i]);
                    }
                } else {
                    this._transaction.splice((this._transaction.findIndex((tx) => tx.unconfirmed) || 0) + 1, 0, rs.data[i]);
                }
            }
        }
    }
}
