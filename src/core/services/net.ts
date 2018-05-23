import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export const NetList = {
    Test: {
        API: 'http://192.168.1.90:8080',
        RPC: 'http://192.168.1.23:20332'
    },
    Main: {
        API: 'http://192.168.1.90:8080',
        RPC: 'http://192.168.1.23:20332'
    },
    Priv: {
        API: 'http://192.168.1.90:8080',
        RPC: 'http://192.168.1.23:20332'
    }
};

// public apiDomain: string = 'http://149.28.17.215:8080';
// public rpcDomain: string = 'http://47.52.16.229:50000';

@Injectable()
export class NetService {
    private currNet = NetList['Priv'];
    constructor(
        private storage: Storage
    ) {
        this.storage.get('net').then((res) => {
            if (res) {
                this.currNet = res;
            }
        });
    }
    public get(type: 'API' | 'RPC' = 'API'): string {
        return this.currNet[type];
    }
    public switch(net: 'Main' | 'Test' | 'Priv') {
        this.currNet = NetList[net];
        this.storage.set('net', this.currNet);
    }
}
