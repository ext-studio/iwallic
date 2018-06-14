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
        if (req.url.indexOf('api.iwallic.com') > -1 && !this.config.online && req.body.method !== 'fetchIwallicConfig') {
            throw 'offline';
        }
        return next.handle(req).map((event) => {
            if (req.url.indexOf('api.iwallic.com') < 0) {
                return event;
            }
            if (event instanceof HttpResponse) {
                if (event.status === 200) {
                    if (event.body.code === 200) {
                        return event.clone({body: event.body.result});
                    } else {
                        throw event.body.msg || 'unknown_error';
                    }
                } else {
                    throw 'network_error';
                }
            }
            return event;
        });
    }
}
