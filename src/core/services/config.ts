import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';

@Injectable()
export class ConfigService {
    private _config: any;
    public current: 'Main' | 'Test' | 'Priv';
    private currNet = {};
    private netList: any = {};
    public online: boolean = true;
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private network: Network
    ) {
        // this.network.onchange().subscribe(() => {
        //     setTimeout(() => {
        //         if (navigator.onLine) {
        //             this.Init().subscribe((res) => console.log(res));
        //         }
        //     }, 1000);
        // });
    }
    public get() {
        return this._config;
    }
    public Init() {
        return new Observable((observer) => {
            this.http.get(`https://iwallic.com/assets/config/app.json`).subscribe((config) => {
                this._config = config || false;
                this.netList = this._config.net || false;
                if (!this.netList) {
                    this.online = false;
                }
                if (this._config) {
                    this.storage.set('local_config', this._config);
                }
                this.online = true;
                this.storage.get('net').then((res) => {
                    if (res) {
                        this.currNet = this.netList[res];
                        this.current = res;
                        observer.next('complete');
                        observer.complete();
                    } else {
                        this.currNet = this.netList['Main'];
                        this.current = 'Main';
                        observer.next('config_but_net');
                        observer.complete();
                    }
                }).catch(() => {
                    this.currNet = this.netList['Main'];
                    this.current = 'Main';
                    observer.next('config_but_net');
                    observer.complete();
                });
            }, (err) => {
                this._config = false;
                this.netList = false;
                if (!this.netList) {
                    this.online = false;
                }
                observer.next('offline');
                observer.complete();
            });
        });
    }

    public net(type: 'API' | 'RPC' = 'API'): string {
        return this.currNet && this.currNet[type];
    }
    public switch(net: 'Main' | 'Test' | 'Priv') {
        this.currNet = this.netList[net];
        this.current = net;
        this.storage.set('net', net);
    }
}
