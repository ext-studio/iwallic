import { Injectable } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import QrCodeWithLogo from 'qr-code-with-logo';
import { Platform } from '@ionic/angular';
import { TranslateService as NgTranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalService {
    public popups: any[] = [];
    public masks: any[] = [];

    constructor(
        private clipboard: Clipboard,
        private platform: Platform
    ) {}
    
    public GenerateQRCode(dom: string, content: string, size: number, logo: string) {
        const qrcode = document.getElementById(dom);
        QrCodeWithLogo.toImage({
            image: qrcode,
            content: content,
            width: size,
            logo: {
                src: logo,
                radius: 8
            }
        });
        return ;
    }
    public Copy(content: string) {
        if (this.platform.is('ios')) {
            return this.clipboard.copy(content);
        } else {
            return Promise.reject(99799);
        }
    }
}
