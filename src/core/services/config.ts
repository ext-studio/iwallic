import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { HttpService } from './http';

@Injectable()
export class ConfigService {
    public currentNet: 'main' | 'test' | 'priv';
    public get online(): boolean {
        return this.http.online;
    }
    constructor(
        private storage: Storage,
        private appVersion: AppVersion,
        private platform: Platform,
        private network: Network,
        private http: HttpService
    ) {
        setTimeout(() => {
            this.network.onchange().subscribe(() => {
                setTimeout(() => {
                    if (this.online && navigator.onLine) {
                        return;
                    }
                    if (navigator.onLine) {
                        this.Init().subscribe();
                    } else {
                        this.http.online = false;
                        this.http.$net.next(false);
                    }
                }, 1000);
            }, (err) => {
                console.log(err);
            });
        }, 3000);
    }
    public get() {
        return this.http._config;
    }
    public $net() {
        return this.http.$net.publish().refCount().startWith(this.online);
    }
    public apiDomain(): string {
        return this.http._config.net[this.currentNet].api;
    }
    public Init() {
        return this.http.config();
    }
    public NetInit() {
        this.storage.get('config_neonet').then((net) => {
            this.currentNet = net || 'main';
        }).catch(() => {
            this.currentNet = 'main';
        });
    }
    public NetSwitch(net: 'main' | 'test' | 'priv') {
        this.currentNet = net;
        this.storage.set('config_neonet', net);
    }
    public VersionInit() {
        return from(this.appVersion.getVersionNumber()).pipe(map((ver) => {
            let version;
            if (this.platform.is('ios')) {
                version = this.http._config.version_ios || false;
            } else if (this.platform.is('android')) {
                version = this.http._config.version_android || false;
            } else {
                throw 99996;
            }
            if (!this.online) {
                version = {code: ver};
            }
            return {curr: ver, latest: version.code, url: version.url, info: version.info};
        }), catchError((err) => {
            return Observable.throw(99995);
        }));
    }
}
