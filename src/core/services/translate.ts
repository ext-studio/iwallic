import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/observable';

@Injectable()
export class Translate {
    private _current: string;
    constructor(
        private storage: Storage,
        private translate: TranslateService
    ) {}
    public Current(): Observable<string> {
        return new Observable((observer) => {
            if (this._current) {
                observer.next(this._current);
                observer.complete();
                return;
            }
            this.storage.get('language').then((res) => {
                this._current = res || 'cn';
                observer.next(this._current);
                observer.complete();
            }).catch((err) => {
                observer.next(this._current);
                observer.complete();
            });
        });
    }

    public Set(lang: string): Observable<any> {
        return Observable.fromPromise(this.storage.set('language', lang));
    }

    public Switch(lang: string) {
        this._current = 'en';
        this.translate.use(lang);
    }
}
