import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http';
import { GlobalService } from '../services/global';
import { ConfigService } from '../services/config';

@Injectable()
export class BlockState {
    private interval: number;
    private _block: number = 0;
    private _last: number = 0;
    private _loading: boolean = false;
    private $listen: Subject<any> = new Subject<any>();
    private $error: Subject<any> = new Subject<any>();
    constructor(
        private http: HttpService,
        private global: GlobalService,
        private config: ConfigService
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
        return new Promise((resolve, reject) => {
            this.http.post(`${this.global.apiDomain}/api/iwallic`, {method: 'getblocktime'}).subscribe((res: any) => {
                if (
                    res && res.lastBlockIndex && res.time &&
                    this._block !== res.lastBlockIndex
                ) {
                    this._block = res.lastBlockIndex;
                    this._last = res.time * 1000;
                    this.$listen.next(res);
                } else if (force) {
                    this.$listen.next(res);
                } else {
                    this.$error.next(res && res.msg || 99989);
                }
                resolve();
            }, (err) => {
                if (!this.config.online) {
                    resolve();
                    return;
                }
                this.$error.next(err);
                this._loading = false;
                resolve();
            });
        }).catch(() => {});
    }
}
