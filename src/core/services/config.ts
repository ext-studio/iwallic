import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
    private _config: any;
    constructor(
        private http: HttpClient
    ) { }
    public get() {
        return this._config;
    }
    public Init() {
        return this.http.get(`https://iwallic.com/assets/config/app.json`).map((res) => {
            this._config = res || {};
        });
    }
}
