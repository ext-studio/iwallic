import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { Subject } from 'rxjs/Subject';
import { Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { HTTP } from '@ionic-native/http';

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
        private storage: Storage,
        private appVersion: AppVersion,
        private platform: Platform,
        private network: Network,
        private ionHttp: HTTP
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
            this.ionHttp.setDataSerializer('json');
            this.ionHttp.post(`https://api.iwallic.com/api/iwallic`, {
                method: 'fetchIwallicConfig',
                params: []
            }, {'Content-Type': 'application/json'}).then((res) => {
                let data;
                try {
                    data = JSON.parse(res.data);
                    if (data.code === 200) {
                        return data.result;
                    } else {
                        return Promise.reject(res.data.msg || 'unknown_error');
                    }
                } catch {
                    return Promise.reject(res.data.msg || 'parse_error');
                }
            }).then((config: any) => {
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
            }).catch(() => {
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
    public version() {
        return new Observable((observer) => {
            this.appVersion.getVersionNumber().then((ver) => {
                let version;
                if (this.platform.is('ios')) {
                    version = this._config.version_ios || false;
                } else if (this.platform.is('android')) {
                    version = this._config.version_android || false;
                } else {
                    observer.error('unsupport platform');
                    return;
                }
                if (!this.online) {
                    version = {code: ver};
                }
                observer.next({curr: ver, latest: version.code, url: version.url});
                observer.complete();
                return;
            }).catch(() => {
                observer.error('no need');
                return;
            });
        });
    }
}
