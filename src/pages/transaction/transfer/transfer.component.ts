import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService } from '../../../core';
import { WalletService } from '../../../neo';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
    selector: 'transaction-transfer',
    templateUrl: 'transfer.component.html',
})
export class TxTransferComponent implements OnInit {
    public balance: number;
    public isfocus: boolean = false;
    constructor(
        private input: PopupInputService,
        private vcRef: ViewContainerRef,
        private w: WalletService,
        private global: GlobalService,
        private qrScanner: QRScanner
    ) { }

    public ngOnInit() {
        this.balance = 0;
    }

    public focusNum() {
        this.isfocus = true;
    }
    public blurNum() {
        this.isfocus = false;
    }

    public enterPwd() {
        this.input.open(this.vcRef, 'ENTER').afterClose().subscribe((res) => {
            if (!res) {
                return;
            }
            this.w.Match(res).then(() => {
                console.log(true);
            }).catch((err) => {
                this.global.Alert(err === 'not_match' ? 'WRONGPWD' : 'UNKNOWN');
            });
        });
    }

    public qrScan() {
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                if (status.authorized) {
                    // camera permission was granted

                    alert(1);
                    // start scanning
                    const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        console.log('Scanned something', text);

                        this.qrScanner.hide(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                        alert(text);
                    });
                    this.qrScanner.show();
                    alert(status.showing);

                } else if (status.denied) {
                    alert(2);
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    alert(3);
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => alert('Error is'));
    }
}
