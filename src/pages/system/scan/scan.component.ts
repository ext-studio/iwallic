import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
    selector: 'scan',
    templateUrl: 'scan.component.html'
})
export class ScanAddrComponent implements OnInit {

    protected light: boolean = false;
    protected frontCamera: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private qrScanner: QRScanner,
        public viewCtrl: ViewController
    ) {
    }

    public ngOnInit() {
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    // camera permission was granted

                    // start scanning
                    const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        // alert(text);

                        this.qrScanner.hide(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                    });

                    // show camera preview
                    this.qrScanner.show();

                    // wait for user to scan something, then the observable callback will be called

                } else if (status.denied) {
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => console.log('Error is', e));
    }
    public dismiss(): void {
        this.viewCtrl.dismiss();
    }
    public toggleLight() {
        this.light = !this.light;
        if (this.light) {
            this.qrScanner.disableLight();
        } else {
            this.qrScanner.enableLight();

        }
    }
    public toggleCamera() {
        this.frontCamera = !this.frontCamera;
        if (this.frontCamera) {
            this.qrScanner.useBackCamera();
        } else {
            this.qrScanner.useFrontCamera();
        }
    }

}
