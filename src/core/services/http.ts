import { Injectable } from '@angular/core';
import { HTTP as NativeHttp} from '@ionic-native/http';
import { HttpClient as NgHttp } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import { Storage } from '@ionic/storage';

const DefaultConfig = {
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
    'system': {
        'welcomedelay': 0,
        'welcomeimg': {
            'en': null,
            'cn': null
        }
    }
};

@Injectable()
export class HttpService {
    public online: boolean = true;
    public _config = DefaultConfig;
    public $net: Subject<any> = new Subject();
    constructor(
        private ng: NgHttp
    ) { }

    public post(url: string, data: any): Observable<any> {
        return this.ng.post(url, data);
    }

    public get(url: string): Observable<any> {
        return this.ng.get(url);
    }

    public config() {
        return Observable.of(DefaultConfig);
    }
}
