import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { TxTransferComponent, WalletOpenComponent } from '../../../pages';
import { GlobalService } from '../../../core';
import { WalletService } from '../../../neo';

@Component({
    selector: 'scan',
    templateUrl: 'scan.component.html'
})
export class ScanComponent implements OnInit {

    protected light: boolean = false;
    protected frontCamera: boolean = false;
    private scanType: string = 'address';

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private qrScanner: QRScanner,
        private viewCtrl: ViewController,
        private global: GlobalService,
        private wallet: WalletService
    ) {
        this.scanType = this.navParams.get('type');
    }

    public ngOnInit() {
        this.showCamera();
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    this.qrScanner.show();
                    this.showCamera();
                    if (this.scanType === 'address') {
                        this.scanAddress();
                    } else if (this.scanType === 'WIF') {
                        this.scanWIF();
                    } else {
                        this.global.Alert('UNKNOWN').subscribe();
                    }
                } else if (status.denied) {
                    this.navCtrl.pop();
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
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
    public checkWif(text: string) {
        if (!text && !this.wallet.CheckWIF(text)) {
            this.global.AlertI18N({
                title: 'ALERT_TITLE_WARN',
                content: 'ALERT_CONTENT_WIFERROR',
                ok: 'ALERT_OK_SURE'
            }).subscribe((res) => {
                this.scanAddress();
                return false;
            });
        }
        return true;

    }

    public scanAddress() {
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (!this.checkAddress(text)) {
                return;
            }
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.hideCamera();
            this.navCtrl.insert(this.navCtrl.indexOf(this.navCtrl.last()) - 1, TxTransferComponent, {
                animate: false,
                addr: text,
                asset: this.navParams.get('asset'),
                assetSymbol: this.navParams.get('assetSymbol'),
                assetBalance: this.navParams.get('assetBalance')
            });
            this.navCtrl.pop({ animate: false });
            this.navCtrl.pop();
        });
    }

    public scanWIF() {
        const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            if (!this.checkAddress(text)) {
                return;
            }
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.hideCamera();
            this.navCtrl.insert(this.navCtrl.indexOf(this.navCtrl.last()) - 1, WalletOpenComponent, {
                animate: false,
                wif: text,
            });
            this.navCtrl.pop({ animate: false });
            this.navCtrl.pop();
        });
    }

}
