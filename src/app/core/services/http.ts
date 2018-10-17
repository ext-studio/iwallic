import { Injectable } from '@angular/core';
import { HTTP as NativeHttp } from '@ionic-native/http/ngx';
import { HttpClient as NgHttp, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Injectable()
export class HttpService {
    public neoNet: 'main' | 'test' | 'priv' = 'main';

    private apiDomain: String = 'https://iwallic.forchain.info';
    private rpcDomain = {
        main: 'http://101.132.97.9:8001/api/iwallic',
        test: 'http://101.132.97.9:8002/api/iwallic'
    };
    private requestVersion = '1.0.0';

    constructor(
        private appVersion: AppVersion,
        private storage: Storage,
        private native: NativeHttp,
        private ng: NgHttp,
        private platform: Platform
    ) {
        this.storage.get('config_neonet').then((net) => {
            this.neoNet = net || 'main';
        }).catch(() => {
            this.neoNet = 'main';
        });
    }

    public Version() {
        return this.get('/client/index/app_version/detail')
            .pipe(switchMap((res) => from(this.appVersion.getVersionNumber())
            .pipe(map((local) => {
                return [local, res];
            }))), catchError((err) => {
                console.log('version', err);
                throw 99995;
            }));
    }

    public postGo(method: string, data: any): Observable<any> {
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.native.setDataSerializer('json');
            return from(this.native.post(
                this.rpcDomain[this.neoNet],
                {
                    method: method,
                    data: data
                }, {'Content-Type': 'application/json'})
            ).pipe(map((res) => {
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
            }), catchError((err) => {
                return Observable.throw(err);
            }));
        } else {
            return this.ng.post(this.rpcDomain[this.neoNet], {
                method: method,
                data: data
            });
        }
    }

    public post(url: string, data: any): Observable<any> {
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.native.setDataSerializer('json');
            return from(this.native.post(
                `${this.apiDomain}${url}`,
                data,
                {
                    'Content-Type': 'application/json',
                    'app_version': this.requestVersion,
                    'network': this.neoNet
                })).pipe(map((res) => {
                if (res.status === 200 && res.data) {
                    try {
                        const json = JSON.parse(res.data);
                        if (json.bool_status === true) {
                            return json.data;
                        } else {
                            throw json.error_code || 99999;
                        }
                    } catch (e) {
                        throw typeof e === 'number' ? e : 99994;
                    }
                } else if (/^[5]/.test(`${res.status}`)) {
                    throw 99979;
                } else {
                    throw 99998;
                }
            }), catchError((err) => {
                return Observable.throw(err);
            }));
        } else {
            return this.ng.post(`${this.apiDomain}${url}`, data, {
                headers: new HttpHeaders()
                    .set('app_version', this.requestVersion)
                    .set('network', this.neoNet)
            }).pipe(map((res: any) => {
                if (res.bool_status === true) {
                    return res.data;
                } else {
                    throw res.error_code || 99999;
                }
            }), catchError((err) => {
                console.log('http', err);
                throw 99999;
            }));
        }
    }

    public get(url: string): Observable<any> {
        // if (this.platform.is('ios') || this.platform.is('android')) {
        //     this.native.setDataSerializer('json');
        //     return from(this.native.get(
        //         `${this.apiDomain}${url}`,
        //         null,
        //         {
        //             'Content-Type': 'application/json',
        //             'app_version': this.requestVersion,
        //             'network': this.neoNet
        //         })).pipe(map((res) => {
        //         if (res.status === 200 && res.data) {
        //             try {
        //                 const json = JSON.parse(res.data);
        //                 if (json.bool_status === true) {
        //                     return json.data;
        //                 } else {
        //                     throw json.error_code || 99999;
        //                 }
        //             } catch (e) {
        //                 throw typeof e === 'number' ? e : 99994;
        //             }
        //         } else if (/^[5]/.test(`${res.status}`)) {
        //             throw 99979;
        //         } else {
        //             throw 99998;
        //         }
        //     }), catchError((err) => {
        //         return Observable.throw(err);
        //     }));
        // } else {
            return this.ng.get(`${this.apiDomain}${url}`, {
                headers: new HttpHeaders()
                    .set('app_version', this.requestVersion)
                    .set('network', this.neoNet)
            }).pipe(map((res: any) => {
                if (res.bool_status === true) {
                    return res.data;
                } else {
                    throw res.error_code || 99999;
                }
            }), catchError((err) => {
                console.log('http', err);
                throw 99999;
            }));
        // }
    }
}
