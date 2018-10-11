import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { GlobalService } from '../../services/global';
import { Subject } from 'rxjs';
import { wallet } from '@cityofzion/neon-js';

@Component({
    selector: 'scan',
    templateUrl: 'scan.component.html'
})
export class ScanComponent implements OnInit {

    protected light: boolean = false;
    protected frontCamera: boolean = false;
    private scanType: string = 'address';
    private $enter: Subject<any>;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private qrScanner: QRScanner,
        private viewCtrl: ViewController,
        private global: GlobalService
    ) {
        this.scanType = this.navParams.get('type');
        this.$enter = this.navParams.get('subject');
    }

    public ngOnInit() {
        this.showCamera();
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    this.qrScanner.show();
                    this.showCamera();
                    if (this.scanType === 'ADDRESS') {
                        this.scanAddress();
                    } else if (this.scanType === 'WIF') {
                        this.scanWIF();
                    } else {
                        this.global.Alert('UNKNOWN').subscribe();
                        this.navCtrl.pop();
                    }
                } else if (status.denied) {
                    this.navCtrl.pop();
                } else {
                    this.navCtrl.pop();
                }
            })
            .catch((e: any) => console.log('Error is', e));
    }
    public ionViewWillLeave() {
        this.qrScanner.disableLight();
        this.qrScanner.useBackCamera();
        this.qrScanner.hide();
        this.qrScanner.destroy();
        this.hideCamera();
    }

    public dismiss(): void {
        this.viewCtrl.dismiss();
    }
    public toggleLight() {
        if (this.light) {
            this.qrScanner.disableLight();
        } else {
            this.qrScanner.enableLight();
        }
        this.light = !this.light;
    }
    public toggleCamera() {
        if (this.frontCamera) {
            this.qrScanner.useBackCamera();
        } else {
            this.qrScanner.useFrontCamera();
        }
        this.frontCamera = !this.frontCamera;
    }
    public showCamera() {
        (window.document.getElementsByTagName('ion-app')[0] as any).style.background = 'transparent';
        (window.document.getElementsByClassName('nav-decor')[0] as any).style.background = 'transparent';
    }
    public hideCamera() {
        (window.document.getElementsByTagName('ion-app')[0] as any).style.background = 'white';
        (window.document.getElementsByClassName('nav-decor')[0] as any).style.background = 'white';
    }

    public checkAddress(text: string): boolean {
        const reg = new RegExp('^([a-zA-Z0-9]){34}$');
        const addressFlag = reg.test(text);
        if (!addressFlag) {
            this.global.AlertI18N({
                title: 'ALERT_TITLE_WARN',
                content: 'ALERT_CONTENT_ADDRESSERROR',
                ok: 'ALERT_OK_SURE'
            }).subscribe((res) => {
                this.scanAddress();
            });
        }
        return addressFlag;
    }
    public checkWIF(text: string) {
        if (!text || !wallet.isWIF(text)) {
            this.global.AlertI18N({
                title: 'ALERT_TITLE_WARN',
                content: 'ALERT_CONTENT_WIFERROR',
                ok: 'ALERT_OK_SURE'
            }).subscribe((res) => {
                this.scanWIF();
                return false;
            });
        } else {
             return true;
        }
    }

    public scanAddress() {
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (!this.checkAddress(text)) {
                return;
            }
            this.$enter.next(text);
            this.$enter.complete();
            scanSub.unsubscribe(); // stop scanning
            this.navCtrl.pop();
        });
    }

    public scanWIF() {
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (!this.checkWIF(text)) {
                return;
            }
            this.$enter.next(text);
            this.$enter.complete();
            scanSub.unsubscribe(); // stop scanning
            this.navCtrl.pop();
        });
    }

}
