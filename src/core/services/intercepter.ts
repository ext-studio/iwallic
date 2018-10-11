import { Injectable } from '@angular/core';
import {
    HttpInterceptor as NgHttpInterceptor, HttpEvent,
    HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { ConfigService } from './config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {
    constructor(
        private config: ConfigService
    ) {}
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let prepare = Observable.of<any>(true);
        if (!this.config.online && req.url.indexOf('api.iwallic.com') > -1 && req.body.method !== 'fetchIwallicConfig') {
            if (navigator.onLine) {
                prepare = this.config.Init();
            } else {
                return Observable.throw(99997);
            }
        }
        return prepare.switchMap(() => next.handle(req).map((event) => {
            if (req.url.indexOf('api.iwallic.com') < 0) {
                return event;
            }
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    if (event.body.code === 200) {
                        return event.clone({body: event.body.result});
                    } else {
                        throw event.body.code || 99999;
                    }
                } else {
                    throw 99998;
                }
            }
            return event;
        }));
    }
}
