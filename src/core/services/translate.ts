import { TranslateService as NgTranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslateService {
    private _current: string;
    constructor(
        private storage: Storage,
        private translate: NgTranslateService
    ) {}
    public Current(): Observable<string> {
        return new Observable((observer) => {
            if (this._current) {
                observer.next(this._current);
                observer.complete();
                return;
            }
            this.storage.get('language').then((res) => {
                if (res) {
                    this._current = res;
                    observer.next(this._current);
                    observer.complete();
                } else {
                    observer.error(99991);
                }
            }).catch((err) => {
                observer.error(err);
            });
        });
    }

    public Set(lang: string): void {
        if (lang === 'sys') {
            this.storage.remove('language');
        } else {
            this.storage.set('language', lang);
        }
    }

    public Switch(lang: string) {
        this._current = lang;
        this.switchLang(lang);
        this.Set(lang);
    }

    public Init() {
        this.translate.setDefaultLang('en');
        return this.Current().map((lang) => {
            this.switchLang(lang);
            return lang;
        }).catch(() => {
            let lang = 'sys';
            const sysLang = window.navigator.language.toLocaleLowerCase();
            switch (sysLang) {
                case 'zh-tw':
                case 'zh-tw':
                case 'zh-cn':
                lang = 'cn';
                break;
                default:
                lang = 'en';
                break;
            }
            this.switchLang(lang);
            return Observable.of(lang);
        });
    }

    private switchLang(lang: string) {
        if (lang === 'sys') {
            const sysLang = window.navigator.language.toLocaleLowerCase();
            switch (sysLang) {
                case 'zh-tw':
                case 'zh-tw':
                case 'zh-cn':
                lang = 'cn';
                break;
                default:
                lang = 'en';
                break;
            }
        }
        this.translate.use(lang);
    }
}
