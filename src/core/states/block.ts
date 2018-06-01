import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global';

@Injectable()
export class BlockState {
    private interval: number;
    private _block: number = 0;
    private _last: number = 0;
    private _loading: boolean = false;
    private $listen: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) { }
    public listen(): Observable<any> {
        if (!this.interval) {
            this.interval = window.setInterval(() => {
                if (this._loading) {
                    return;
                }
                if (new Date().getTime() - this._last > 20000) {
                    this.fetch();
                }
            }, 10000);
        }
        return this.$listen.publish().refCount();
    }
    public fetch(force: boolean = false): Promise<any> {
        this._loading = true;
        return new Promise((resolve) => {
            this.http.post(`${this.global.apiDomain}/api/iwallic`, {method: 'getblocktime'}).subscribe((res: any) => {
                if (res && res.code === 200) {
                    if (
                        res.result && res.result.lastBlockIndex && res.result.time &&
                        this._block !== res.result.lastBlockIndex
                    ) {
                        this._block = res.result.lastBlockIndex;
                        this._last = res.result.time * 1000;
                        this.$listen.next(res.result);
                    } else if (force) {
                        this.$listen.next(res.result);
                    } else {
                        this.$error.next(res && res.msg || 'block_error');
                    }
                } else {
                    this.$error.next(res && res.msg || 'unknown_error');
                }
                this._loading = false;
                resolve();
            }, (err) => {
                console.log(err);
                this.$error.next(err);
                this._loading = false;
                resolve();
            });
        }).catch(() => {});
    }
}
