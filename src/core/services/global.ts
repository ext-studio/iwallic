import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
    public apiDomain: string = 'http://127.0.0.1:9999';
    constructor() { }
}
