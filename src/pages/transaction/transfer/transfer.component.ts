import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService } from '../../../core';
import { NavController } from 'ionic-angular';
import { WalletService } from '../../../neo';
import { ScanAddrComponent } from '../../../pages';

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
        private navCtrl: NavController
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
        this.navCtrl.push(ScanAddrComponent);
    }
}
