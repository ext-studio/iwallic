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
    public isfocus: boolean = false;
    public toaddr: string = '';
    public wallet: Wallet;
    public transferValue: number;
    public asset: string;
    public assetName: string;
    public assetBalance: number = 0;
    public wrongTips: string = '';
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
        console.log(typeof this.assetBalance);
        if (this.navParams.get('addr')) {
            this.toaddr = this.navParams.get('addr');
        }
        if (this.navParams.get('asset')) {
            this.asset = this.navParams.get('asset');
        }
        if (this.navParams.get('assetName')) {
            this.assetName = this.navParams.get('assetName');
        }
        if (this.navParams.get('assetBalance')) {
            this.assetBalance = this.navParams.get('assetBalance');
        }
    }

    public ngOnInit() {
        this.w.Get().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Alert('UNKNOWN');
        });
    }

    public focusNum() {
        this.isfocus = true;
    }
    public blurNum() {
        this.isfocus = false;
    }

    public enterPwd() {
        if (this.toaddr.length !== 34) {
            this.wrongTips = '地址格式错误';
            return;
        }
        if (this.transferValue) {
            if (parseFloat(this.transferValue.toString()) > parseFloat(this.assetBalance.toString())) {
                this.wrongTips = '打款数额超出可用余额';
                return;
            }
        } else {
            this.wrongTips = '打款金额不得为空';
            return;
        }
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
