import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/publish';
import 'rxjs/operators/refCount';

@Injectable()
export class ReadFileService {
    private input: HTMLInputElement;
    constructor() {}
    public read(): Observable<any> {
        return new Observable((observer) => {
            this.input = window.document.createElement('input');
            this.input.type = 'file';
            this.input.click();
            this.input.onchange = (e: any) => {
                const file = e && e.path[0] && (e.path[0].files as FileList)[0];
                if (!file) {
                    observer.error('failed');
                    return;
                }
                if (file.type !== 'application/json') {
                    observer.error('type_error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    if (event.target.readyState === 2) {
                        try {
                            const rs = JSON.parse(reader.result);
                            observer.next(rs);
                            observer.complete();
                        } catch (e) {
                            observer.error('format_error');
                        }
                    }
                };
                reader.readAsText(file);
            };
        });
    }
}
