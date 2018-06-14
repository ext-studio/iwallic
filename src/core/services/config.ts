import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ConfigService {
    private _config: any;
    public current: 'main' | 'test' | 'priv';
    private currNet = {};
    private netList: any = {};
    private _online: boolean = true;
    public get online(): boolean {
        return this._online;
    }
    private _$net: Subject<any> = new Subject();
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private network: Network
    ) {
        setTimeout(() => {
            this.network.onchange().subscribe(() => {
                setTimeout(() => {
                    if (this.online && navigator.onLine) {
                        return;
                    }
                    if (navigator.onLine) {
                        this.Init().subscribe((res) => console.log(res));
                    } else {
                        this._online = false;
                        this._$net.next(false);
                    }
                }, 1000);
            });
        }, 3000);
    }
    public get() {
        return this._config;
    }
    public $net() {
        return this._$net.publish().refCount().startWith(this.online);
    }
    public Init() {
        return new Observable((observer) => {
            this.http.post(`https://api.iwallic.com/api/iwallic`, {
                method: 'fetchIwallicConfig',
                params: []
            }).map((rs: any) => {
                if (rs.code === 200 && rs.result) {
                    return rs.result;
                } else {
                    throw 'offline';
                }
            }).subscribe((config: any) => {
                this._config = config || false;
                this.netList = this._config.net || false;
                this._online = true;
                this.storage.get('net').then((res: any) => {
                    if (res) {
                        this.currNet = this.netList[res] || this.netList['main'];
                        this.current = res;
                        this._$net.next(true);
                        observer.next('complete');
                        observer.complete();
                    } else {
                        this.currNet = this.netList['main'];
                        this.current = 'main';
                        this._$net.next(true);
                        observer.next('config_but_net');
                        observer.complete();
                    }
                }).catch(() => {
                    this.currNet = this.netList['main'];
                    this.current = 'main';
                    this._$net.next(true);
                    observer.next('config_but_net');
                    observer.complete();
                });
            }, () => {
                this._config = false;
                this.netList = false;
                this._online = false;
                this._$net.next(false);
                observer.next('offline');
                observer.complete();
            });
        });
    }

    public net(type: 'api' | 'rpc' = 'api'): string {
        return this.currNet && this.currNet[type];
    }
    public switch(net: 'main' | 'test' | 'priv') {
        this.currNet = this.netList[net];
        this.current = net;
        this.storage.set('net', net);
    }
}
