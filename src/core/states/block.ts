import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BlockState {
    private _block: any;
    private $listen: Subject<any> = new Subject<any>();
    constructor() { }
    public listen(): Observable<any> {
        return this.$listen.publish().refCount();
    }
}
