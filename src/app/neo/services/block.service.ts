import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Block } from '../models/block';
import { publish, refCount } from 'rxjs/operators';
import { HttpService } from 'app/core';

/**
 * Listen for new block generated.
 * call listen() to start listen
 * call clear() to destroy listen
 * call listen() again to start a new listen
 */
@Injectable()
export class BlockService {
    private listener: Subject<Block> = null;
    private interval: number;
    private loading: boolean = false;
    private last: Block = {lastHeight: 0, latestHeight: 0, time: 0};
    constructor(
        private http: HttpService
    ) {}
    public listen(): Observable<Block> {
        if (this.listener == null) {
            this.listener = new Subject<Block>();
            this.init();
        }
        return this.listener.pipe(publish(), refCount());
    }
    public clear() {
        clearInterval(this.interval);
        this.listener.complete();
        this.listener = null;
    }
    private init() {
        this.interval = setInterval(() => {
            if (this.loading) {
                return;
            }
            this.loading = true;
            this.http.postGo('getblocktime', []).subscribe((res) => {
                this.loading = false;
                if (this.last.latestHeight < res['lastBlockIndex']) {
                    this.last = {lastHeight: this.last.latestHeight, latestHeight: res['lastBlockIndex'], time: res['time']};
                    this.listener.next(this.last);
                } else {
                    console.log('no newer block generated');
                }
            }, (err) => {
                this.loading = false;
                console.log(err);
            });
        }, 90000) as any;
    }
}
