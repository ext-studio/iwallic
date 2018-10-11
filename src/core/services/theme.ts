import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { publish, refCount, startWith } from 'rxjs/operators';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';

@Injectable()
export class ThemeService {
    public default: string = 'light';
    private _theme: string;
    private $theme: Subject<String> = new Subject();

    constructor(
        private statusBar: StatusBar,
        private storage: Storage,
        private platform: Platform
    ) {
        this.storage.get('theme').then((res) => {
            this._theme = res || this.default;
            if (this.platform.is('android')) {
                this.statusBar.styleLightContent();
            } else {
                if (this._theme === 'light') {
                    this.statusBar.styleDefault();
                } else {
                    this.statusBar.styleLightContent();
                }
            }
            this.$theme.next(this._theme);
        }).catch((err) => {
            this._theme = this.default;
            this.$theme.next(this._theme);
        });
    }
    public get(): Observable<any> {
        if (this._theme) {
            return this.$theme.pipe(publish(), refCount(), startWith(this._theme));
        }
        return this.$theme.pipe(publish(), refCount());
    }

    public set(theme: string) {
        this.storage.set('theme', theme);
        this._theme = theme;
        this.$theme.next(this._theme);
        if (this.platform.is('android')) {
            this.statusBar.styleLightContent();
        } else {
            if (this._theme === 'light') {
                this.statusBar.styleDefault();
            } else {
                this.statusBar.styleLightContent();
            }
        }
    }

    public current() {
        return this._theme || this.default;
    }
}
