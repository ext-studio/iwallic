import { Injectable } from '@angular/core';
import { HTTP as NativeHttp} from '@ionic-native/http';
import { HttpClient as NgHttp } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class HttpService {

    constructor(
        private native: NativeHttp,
        private ng: NgHttp,
        private platform: Platform
    ) { }

    public post(url: string, data: any): Observable<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.ng.post(url, data);
        } else if (this.platform.is('ios') || this.platform.is('android')) {
            this.native.setDataSerializer('json');
            return Observable.fromPromise(this.native.post(url, data, {'Content-Type': 'application/json'})).map((res) => {
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
            });
        } else {
            return this.ng.post(url, data);
        }
    }

    public get(url: string): Observable<any> {
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
            return this.ng.get(url);
        } else if (this.platform.is('ios') || this.platform.is('android')) {
            this.native.setDataSerializer('json');
            return Observable.fromPromise(this.native.get(url, null, {'Content-Type': 'application/json'})).map((res: any) => {
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
            });
        } else {
            return this.ng.get(url);
        }
    }
}
