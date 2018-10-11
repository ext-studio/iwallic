import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publish';
import 'rxjs/operators/refCount';
import { Platform, AlertController } from 'ionic-angular';
import { TranslateService as NgTranslateService } from '@ngx-translate/core';


@Injectable()
export class ReadFileService {
    private input: HTMLInputElement;
    constructor(
        private platform: Platform,
        private alert: AlertController,
        private ngTranslate: NgTranslateService
    ) {}
    public read(): Observable<any> {
        if (this.platform.is('core')) {
            return this.byInput();
        } else {
            return this.byCopy();
        }
    }

    private byInput() {
        return new Observable((observer) => {
            this.input = window.document.createElement('input');
            this.input.type = 'file';
            this.input.click();
            this.input.onchange = (e: any) => {
                const file = e && e.path[0] && (e.path[0].files as FileList)[0];
                if (!file) {
                    observer.error(99992);
                    return;
                }
                if (file.type !== 'application/json') {
                    observer.error(99993);
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
                            observer.error(99994);
                        }
                    }
                };
                reader.readAsText(file);
            };
        });
    }

    private byCopy() {
        return this.ngTranslate.get([
            'WALLET_OPEN_COPYTITLE', 'WALLET_OPEN_COPYPH', 'WALLET_OPEN_COPYCANCEL', 'WALLET_OPEN_COPYGO'
        ]).switchMap((res) => {
            return new Observable((observer) => {
                const alert = this.alert.create({
                    title: res['WALLET_OPEN_COPYTITLE'],
                    inputs: [
                      {
                        name: 'content',
                        placeholder: res['WALLET_OPEN_COPYPH'],
                        type: 'password'
                      }
                    ],
                    buttons: [
                        {
                            text: res['WALLET_OPEN_COPYCANCEL'],
                            role: 'cancel',
                            handler: data => {
                                observer.complete();
                            }
                        },
                        {
                            text: res['WALLET_OPEN_COPYGO'],
                            handler: data => {
                                if (data && data.content) {
                                    try {
                                        const rs = JSON.parse(data.content);
                                        observer.next(rs);
                                        observer.complete();
                                    } catch (e) {
                                        observer.error(99994);
                                    }
                                } else {
                                    observer.error(99994);
                                }
                            }
                        }
                    ]
                });
                alert.present();
            });
        });
    }
}
