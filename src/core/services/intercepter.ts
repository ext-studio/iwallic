import { Injectable } from '@angular/core';
import {
    HttpInterceptor as NgHttpInterceptor, HttpEvent,
    HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {
    constructor() {}
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).map((event) => {
            if (req.url.indexOf('api.iwallic.forchain.info') < 0) {
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
        });
    }
}
