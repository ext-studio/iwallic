import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService } from '../../../core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { WalletService, TransactionService, Wallet } from '../../../neo';
import { ScanAddrComponent, TxSuccessComponent } from '../../../pages';

@Component({
    selector: 'transaction-transfer',
    templateUrl: 'transfer.component.html',
})
export class TxTransferComponent implements OnInit {
    public balance: number;
    public isfocus: boolean = false;
    public toaddr: string = '';
    public wallet: Wallet;
    public transferValue: number;
    public asset: string;
    public assetName: string;
    constructor(
        private input: PopupInputService,
        private vcRef: ViewContainerRef,
        private global: GlobalService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private tx: TransactionService,
        private load: LoadingController,
        private w: WalletService,
    ) {
        if (this.navParams.get('addr')) {
            this.toaddr = this.navParams.get('addr');
        }
        if (this.navParams.get('asset')) {
            this.asset = this.navParams.get('asset');
        }
        if (this.navParams.get('assetName')) {
            this.assetName = this.navParams.get('assetName');
        }
    }

    public ngOnInit() {
        this.w.Get().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Alert('UNKNOWN');
        });
        this.balance = 0;
    }

    public focusNum() {
        this.isfocus = true;
    }
    public blurNum() {
        this.isfocus = false;
    }

    public enterPwd() {
        const check = this.input.open(this.vcRef, 'ENTER');
        check.afterClose().subscribe((res) => {
            if (!res) {
                return;
            }
            const load = this.load.create({ content: 'Verifying' });
            load.present();
            this.wallet.Verify(res).subscribe((wres) => {
                load.dismiss();
                this.tx.Transfer(
                    this.wallet.account.address,
                    this.wallet.account.wif,
                    this.toaddr,
                    this.transferValue,
                    this.asset,
                    this.assetName
                ).subscribe((xres) => {
                    if (xres) {
                        this.navCtrl.pop({
                            animate: false
                        });
                        this.navCtrl.push(TxSuccessComponent);
                    }
                }, (err) => {
                    console.log(err);
                });
                return true;
            }, (werr) => {
                load.dismiss();
                this.global.Alert(werr === 'verify_failed' ? 'WRONGPWD' : 'UNKNOWN');
            });
        });
    }

    public qrScan() {
        this.navCtrl.push(ScanAddrComponent);
    }
}
