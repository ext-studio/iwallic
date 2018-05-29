import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NetService {
    public current: 'Main' | 'Test' | 'Priv';
    private currNet;
    private netList: any;
    constructor(
        private storage: Storage,
        private http: HttpClient
    ) { }
    public Init(): Observable<any> {
        return this.http.get(`https://www.iwallic.com/assets/config/net.json`).map((res) => {
            this.netList = res;
            return;
        }).switchMap(() => Observable.fromPromise(this.storage.get('net'))).map((res) => {
            if (res) {
                this.currNet = this.netList[res];
                this.current = res;
            } else {
                this.currNet = this.netList['Main'];
                this.current = 'Main';
            }
            return;
        }).catch(() => {
            this.currNet = this.netList['Main'];
            this.current = 'Main';
            return Observable.of();
        });
    }
    public get(type: 'API' | 'RPC' = 'API'): string {
        return this.currNet[type];
    }
    public switch(net: 'Main' | 'Test' | 'Priv') {
        this.currNet = this.netList[net];
        this.current = net;
        this.storage.set('net', net);
    }
}
