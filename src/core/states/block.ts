import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global';

@Injectable()
export class BlockState {
    private interval: number;
    private _block: any;
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
                this.fetch();
            }, 10000);
            this.fetch();
        }
        return this.$listen.publish().refCount();
    }
    public fetch(): Promise<any> {
        this._loading = true;
        return new Promise((resolve) => {
            this.http.post(`${this.global.apiDomain}/api/index`, {method: 'queryallcounts'}).subscribe((res: any) => {
                if (res && res.code === 200) {
                    const newBlock = res.result.blockCounts || 0;
                    if (newBlock === 0) {
                        this.$error.next(res && res.msg || 'block_error');
                    } else if (this._block !== newBlock) {
                        this._block = newBlock;
                        this.$listen.next(newBlock);
                    }
                } else {
                    this.$error.next(res && res.msg || 'unknown_error');
                }
                this._loading = false;
                resolve();
            }, (err) => {
                this.$error.next(err);
                this._loading = false;
                resolve();
            });
        });
    }
}
