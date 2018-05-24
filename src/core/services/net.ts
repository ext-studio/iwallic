import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export const NetList = {
    Test: {
        API: 'http://47.75.174.167:8002',
        RPC: 'http://seed2.neo.org:20332'
    },
    Main: {
        API: 'http://47.75.174.167:8001',
        RPC: 'http://seed2.neo.org:10332'
    },
    Priv: {
        API: 'http://192.168.1.90:8080',
        RPC: 'http://192.168.1.23:20332'
    }
};

@Injectable()
export class NetService {
    public current: 'Main' | 'Test' | 'Priv';
    private currNet;
    constructor(
        private storage: Storage
    ) { }
    public Init(): Observable<any> {
        return Observable.fromPromise(this.storage.get('net')).map((res) => {
            if (res) {
                this.currNet = NetList[res];
                this.current = res;
            } else {
                this.currNet = NetList['Main'];
                this.current = 'Main';
            }
            return;
        }).catch(() => {
            this.currNet = NetList['Main'];
            this.current = 'Main';
            return Observable.of();
        });
    }
    public get(type: 'API' | 'RPC' = 'API'): string {
        return this.currNet[type];
    }
    public switch(net: 'Main' | 'Test' | 'Priv') {
        this.currNet = NetList[net];
        this.current = net;
        this.storage.set('net', net);
    }
}
