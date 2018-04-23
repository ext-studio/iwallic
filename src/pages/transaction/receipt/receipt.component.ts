import { Component, OnInit } from '@angular/core';
import QrCodeWithLogo from 'qr-code-with-logo';
@Component({
    selector: 'transaction-receipt',
    templateUrl: 'receipt.component.html',
})
export class TxReceiptComponent implements OnInit {
    constructor() { }

    public ngOnInit() {
        this.getQRCode();
    }
    public  getQRCode() {
        const qrcode = document.getElementById('qrcode');
        QrCodeWithLogo.toImage({
            image: qrcode,
            content: 'http://blog.cloudself.cn',
            width: 200,
            logo: {
                src: 'assets/asset/qrcode_logo.png',
                radius: 8
            }
        });
        return ;
    }
}
