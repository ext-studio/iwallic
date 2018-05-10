import { Injectable } from '@angular/core';

@Injectable()
export class RPCService {
    public rpcUrl: string = 'http://192.168.1.23:20332';
    public apiUrl: string = 'http://192.168.1.90:8080';
    constructor() { }
}
