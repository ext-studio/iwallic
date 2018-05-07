import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, GlobalService } from '../../../core';
import { Observable } from 'rxjs/observable';

/**
 * use for data state management
 * to subscribe data:
 *   1. inject as state(.e.g)
 *   2. state.data().subscribe((res) => {
 *        // res is just the data, will take null when first subscribed
 *      });
 *   3. override state.fetch() here to fetch data for above
 *   4. only use $data.next() to emit new data, use data() to subscribe data
 *   5. add more methods here like remove, update(.e.g)
 */
@Injectable()
export class TestState extends State {
    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) {
        super();
    }
    // override
    public fetch(page?: number, size?: number) {
        this.page = page || this.page;
        this.pageSize = size || this.pageSize;
        this.loading = true;
        this.http.post(
            `${this.global.apiAddr}/api/block`,
            { 'method': 'getassets', 'params': [page, size] }
        ).subscribe((res) => {
            // set to cache and next data
            this.loading = false;
            this._data = res;
            this.$data.next(this._data);
        }, (err) => {
            this.loading = false;
            console.log(err);
            // error resolve
            // no next/error here to keep observer quiet
        });
    }
}
