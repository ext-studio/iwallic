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
        if (!this.config.online) {
            throw 'offline';
        }
        return next.handle(req).map((event) => {
            return event;
        });
    }
}
