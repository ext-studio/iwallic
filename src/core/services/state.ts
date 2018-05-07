import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/observable/of';
import 'rxjs/Observable/throw';
import 'rxjs/add/operator/startWith';
import { Subject } from 'rxjs/Subject';

export interface StateBase {
    _data: any;
    page: number;
    pageSize: number;
    loading: boolean;
    data: () => Observable<any>;
    fetch: (config?: any) => void;
    $data: Subject<any>;
}

// @Injectable()
export class State implements StateBase {
    public _data: any = null;
    public page: number = 1;
    public pageSize: number = 10;
    public loading: boolean = false;
    public $data: Subject<any> = new Subject<any>();
    public data() {
        return this.$data.asObservable().publish().refCount().startWith(this._data).map((res) => {
            if (res === null) {
                this.fetch();
            }
            return res;
        });
    }
    public fetch(config?: any) {
        this.$data.error('need_override');
    }
}
