import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService } from '../../../core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
        private alert: AlertController
    ) {
        if (this.navParams.get('addr')) {
            this.toaddr = this.navParams.get('addr');
        }
        this.asset = this.navParams.get('asset');
        this.assetName = this.navParams.get('assetName');
        this.assetBalance = this.navParams.get('assetBalance');
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
            this.wrongTips = 'WRONG_ADDRESS';
            return;
        }
        if (this.transferValue) {
            if (parseFloat(this.transferValue.toString()) > parseFloat(this.assetBalance.toString())) {
                this.wrongTips = 'EXCEEDET_AVAILABLE_BALANCE';
                return;
            }
        } else {
            this.wrongTips = 'NO_AMOUNT';
            return;
        }
        const check =  this.input.open(this.navCtrl, 'ENTER');
        check.subscribe((res) => {
            if (!res) {
                return;
            }
            const load = this.load.create({ content: 'Verifying' });
            load.present();
            this.wallet.Verify(res).subscribe((wres) => {
                load.dismiss();
                const txLoad = this.load.create({ content: 'transfer' });
                this.tx.Transfer(
                    this.wallet.account.address,
                    this.wallet.account.wif,
                    this.toaddr,
                    this.transferValue,
                    this.asset,
                    this.assetName
                ).subscribe((xres) => {
                    txLoad.dismiss();
                    if (xres) {
                        this.navCtrl.pop({
                            animate: false
                        });
                        this.navCtrl.push(TxSuccessComponent);
                    } else {
                        this.alert.create({title: 'Error'}).present();
                    }
                }, (err) => {
                    this.alert.create({title: 'Error'}).present();
                    txLoad.dismiss();
                });
                return true;
            }, (werr) => {
                load.dismiss();
                this.global.Alert(werr === 'verify_failed' ? 'WRONGPWD' : 'UNKNOWN');
            });
        });
    }

    public qrScan() {
        this.navCtrl.push(ScanAddrComponent, {
            asset: this.asset,
            assetName: this.assetName,
            assetBalance: this.assetBalance
        });
    }
}
