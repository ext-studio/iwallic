import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ThemeService {
    private _theme: string;
    private $theme: Subject<String> = new Subject();

    constructor(
        private storage: Storage
    ) {
        this.storage.get('theme').then((res) => {
            this._theme = res || 'light';
            this.$theme.next(this._theme);
        }).catch((err) => {
            this._theme = 'light';
            this.$theme.next(this._theme);
        });
    }
    public get(): Observable<any> {
        if (this._theme) {
            return this.$theme.publish().refCount().startWith(this._theme);
        }
        return this.$theme.publish().refCount();
    }

    public set(theme: string) {
        this.storage.set('theme', theme);
        this._theme = theme;
        this.$theme.next(this._theme);
    }
}
