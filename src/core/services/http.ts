import { Injectable } from '@angular/core';
import { HTTP as NativeHttp} from '@ionic-native/http';
import { HttpClient as NgHttp } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import { Storage } from '@ionic/storage';

const DefaultConfig = {
    time: 23333,
    config: {
        'version_ios': {
            'code': '0.0.8',
            'tag': 'beta',
            'url': 'https://iwallic.com',
            'info': {
                'en': '1. Config module improve. <br> 2. Known issues fix.',
                'cn': '1. 优化配置项. <br> 2. 修复已知问题.'
            }
        },
        'version_android': {
            'code': '0.0.8',
            'tag': 'beta',
            'url': 'https://iwallic.com',
            'info': {
                'en': '1. Config module improve. <br> 2. Known issues fix.',
                'cn': '1. 优化配置项. <br> 2. 修复已知问题.'
            }
        },
        'disclaimer': {
            'action': 'link',
            'enabled': false,
            'data': 'https://iwallic.com'
        },
        'browser': {
            'action': 'link',
            'enabled': false,
            'value': 'blolys.com',
            'data': 'https://blolys.com',
            'tx': 'https://blolys.com/#/transaction/'
        },
        'helpers': {
            'walletguide': {
                'action': 'link',
                'enabled': false,
                'data': 'https://iwallic.com'
            },
            'transactionguide': {
                'action': 'link',
                'enabled': false,
                'data': 'https://iwallic.com'
            },
            'community': {
                'action': 'link',
                'enabled': false,
                'value': 'bbs.iwallic.com',
                'data': 'https://bbs.iwallic.com/portal'
            },
            'contact': {
                'action': 'email',
                'enabled': false,
                'data': 'contact@iwallic.com'
            }
        },
        'net': {
            'test': {
                'api': 'https://teapi.iwallic.com',
                'rpc': 'https://rpc.t.iwallic.com'
            },
            'main': {
                'api': 'https://api.iwallic.com',
                'rpc': 'https://rpc.m.iwallic.com'
            }
        },
        'system': {
            'welcomedelay': 0,
            'welcomeimg': {
                'en': null,
                'cn': null
            }
        }
    }
};

@Injectable()
export class HttpService {
    public online: boolean = true;
    public _config: any;
    public $net: Subject<any> = new Subject();
    constructor(
        private native: NativeHttp,
        private ng: NgHttp,
        private storage: Storage,
        private platform: Platform
    ) { }

    public post(url: string, data: any): Observable<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.ng.post(url, data);
        } else if (this.platform.is('ios') || this.platform.is('android')) {
            let prepare = Observable.of<any>(true);
            if (!this.online && url.indexOf('api.iwallic.com') > -1 && data.method !== 'fetchIwallicConfig') {
                if (navigator.onLine) {
                    prepare = this.config();
                } else {
                    return Observable.throw(99997);
                }
            }
            this.native.setDataSerializer('json');
            return prepare.switchMap(() => Observable.fromPromise(this.native.post(url, data, {'Content-Type': 'application/json'}))
            .map((res) => {
                if (res.status === 200 && res.data) {
                    try {
                        const json = JSON.parse(res.data);
                        if (json.code === 200) {
                            return json.result;
                        } else {
                            throw json.code || 99999;
                        }
                    } catch (e) {
                        throw typeof e === 'number' ? e : 99994;
                    }
                } else if (/^[5]/.test(`${res.status}`)) {
                    throw 99979;
                } else {
                    throw 99998;
                }
            }).catch((err) => {
                return Observable.throw(err);
            }));
        } else {
            return this.ng.post(url, data);
        }
    }

    public get(url: string): Observable<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.ng.get(url);
        } else if (this.platform.is('ios') || this.platform.is('android')) {
            let prepare = Observable.of<any>(true);
            if (!this.online && url.indexOf('api.iwallic.com') > -1) {
                if (navigator.onLine) {
                    prepare = this.config();
                } else {
                    return Observable.throw(99997);
                }
            }
            this.native.setDataSerializer('json');
            return prepare.switchMap(() => Observable.fromPromise(this.native.get(url, null, {'Content-Type': 'application/json'}))
            .map((res: any) => {
                if (res.status === 200 && res.data) {
                    try {
                        const json = JSON.parse(res.data);
                        if (json.code === 200) {
                            return json.result;
                        } else {
                            throw json.msg || 99999;
                        }
                    } catch (e) {
                        throw typeof e === 'number' ? e : 99994;
                    }
                } else if (/^[5]/.test(`${res.status}`)) {
                    throw 99979;
                } else {
                    throw 99998;
                }
            }).catch((err) => {
                return Observable.throw(err);
            }));
        } else {
            return this.ng.get(url);
        }
    }

    public config() {
        return Observable.fromPromise(this.storage.get('local_config')).map((local) => (local || DefaultConfig)).map((config) => {
            this._config = config.config;
            const currTime = new Date().getTime();
            if (currTime - config.time < 21600000) {
                return config.config;
            } else {
                throw currTime - config.time < 86400000;
            }
        }).catch((unexpired) => this.post(`https://api.iwallic.com/api/iwallic`, {
            method: 'fetchIwallicConfig',
            params: []
        }).map((latest) => {
            this.storage.set('local_config', {time: new Date().getTime(), config: latest});
            this._config = latest;
            this.online = true;
            this.$net.next(true);
            return latest;
        }).catch((err) => {
            console.log(err);
            if (unexpired === false) {
                this.online = false;
            } else {
                this.online = navigator.onLine;
            }
            this.$net.next(unexpired === false);
            return Observable.of(this._config);
        })).map((config) => {
            this.online = navigator.onLine;
            this.$net.next(true);
            return config;
        });
    }
}
