import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, GlobalService } from '../../../core';
import { Observable } from 'rxjs/observable';

@Injectable()
export class ListState extends State {
    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) {
        super();
    }
    public init(address: string) {
        this.http.post(
            this.global.apiAddr + '/api/block',
            { 'method': 'getaddressasset', 'params': [address] }
        ).subscribe(result => {
            // to do
            this.fetch();
        }, (err) => {
            this.global.Alert('REQUESTFAILED');
        });
    }
    // override
    public fetch(page?: number, size?: number) {
        this.page = page || this.page;
        this.pageSize = size || this.pageSize;
        this.http.post(
            this.global.apiAddr + '/api/block',
            { 'method': 'getassets', 'params': [this.page, this.pageSize] }
        ).subscribe(res => {
            // set new data to this._data
            this._data = [];
            this.$data.next(this._data);
        }, (err) => {
            this.global.Alert('REQUESTFAILED');
        });
    }
}
