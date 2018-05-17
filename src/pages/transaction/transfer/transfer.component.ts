import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService, TransactionState, BalanceState } from '../../../core';
import { NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
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
    public amount: number;
    public asset: string;
    public assetName: string;
    public assetBalance: number = 0;
    public wrongTips: string = '';
    public isNEP5: boolean = true;
    public assetList: any[] = [];
    public select: any;
    public isScan: boolean = true;
    constructor(
        private input: PopupInputService,
        private vcRef: ViewContainerRef,
        private global: GlobalService,
        private navCtrl: NavController,
        private navParams: NavParams,
        private tx: TransactionService,
        private load: LoadingController,
        private w: WalletService,
        private alert: AlertController,
        private txState: TransactionState,
        private balanceState: BalanceState,
        private platform: Platform
    ) {
        if (this.navParams.get('addr')) {
            this.toaddr = this.navParams.get('addr');
        }
        if (this.navParams.get('asset')) {
            this.asset = this.navParams.get('asset');
        }
        if (this.navParams.get('assetName')) {
            this.assetName = this.assetName = this.navParams.get('assetName');
        }
        if (this.navParams.get('assetBalance')) {
            this.assetBalance = this.assetBalance = this.navParams.get('assetBalance');
        }
    }

    public ngOnInit() {
        if (this.platform.is('mobileweb') || this.platform.is('core')) {
            this.isScan = false;
        }
        this.balanceState.get(this.w.address).subscribe((res) => {
            this.assetList = res;
            const value = res.find((e) => e.assetId === this.asset);
            this.assetBalance = value ? value.balance : 0;
        });
        this.w.Get().subscribe((res) => {
            this.wallet = res;
        }, (err) => {
            this.global.Alert('UNKNOWN').subscribe();
        });
    }

    public assetChange() {
        this.assetBalance = this.assetList.find((e) => e.assetId === this.asset).balance;
    }

    public focusNum() {
        this.isfocus = true;
    }
    public blurNum() {
        this.isfocus = false;
    }

    public enterPwd() {
        if (this.toaddr.length !== 34) {
            this.wrongTips = 'TRANSACTION_TRANSFER_WRONGADDRESS';
            return;
        }
        if (this.amount) {
            if (parseFloat(this.amount.toString()) > parseFloat(this.assetBalance.toString())) {
                this.wrongTips = 'TRANSACTION_TRANSFER_EXCEEDETBALANCE';
                return;
            }
        } else {
            this.wrongTips = 'TRANSACTION_TRANSFER_NOAMOUNT';
            return;
        }
        const check = this.input.open(this.navCtrl, 'ENTER');
        check.subscribe((res) => {
            if (!res) {
                return;
            }
            this.global.LoadI18N('LOADING_VERIFY').subscribe((load) => {
                this.wallet.Verify(res).subscribe((wres) => {
                    load.dismiss();
                    this.global.LoadI18N('LOADING_TRANSFER').subscribe((transferLoad) => {
                        // this.tx.Transfer(
                        //     this.wallet.account.address,
                        //     this.wallet.account.wif,
                        //     this.toaddr,
                        //     this.amount,
                        //     this.asset,
                        //     this.assetName
                        // ).subscribe((xres) => {
                        //     transferLoad.dismiss();
                        // if (xres) {
                        //     this.navCtrl.pop({
                        //         animate: false
                        //     });
                        //     this.navCtrl.push(TxSuccessComponent);
                        // } else {
                        //     this.alert.create({title: 'Error'}).present();
                        // }
                        // }, (err) => {
                        //     this.alert.create({title: 'Error'}).present();
                        //     transferLoad.dismiss();
                        // });
                        if (this.asset.length > 42) {
                            this.isNEP5 = false;
                        }
                        this.tx.Send(
                            this.wallet.account.address,
                            this.toaddr,
                            this.amount,
                            this.wallet.account.wif,
                            this.asset,
                            this.isNEP5
                        ).subscribe((xres) => {
                            transferLoad.dismiss();
                            this.txState.push(this.assetName, xres.txid, xres.value);
                            this.navCtrl.pop({
                                animate: false
                            });
                            this.navCtrl.push(TxSuccessComponent);
                            return;
                        }, (err) => {
                            transferLoad.dismiss();
                            this.global.AlertI18N({
                                title: 'ALERT_TITLE_WARN',
                                content: 'ALERT_CONTENT_TXFAILED',
                                ok: 'ALERT_OK_SURE'
                            }).subscribe();
                        });
                    });
                }, (werr) => {
                    load.dismiss();
                    this.global.Alert(werr === 'verify_failed' ? 'WRONGPWD' : 'UNKNOWN').subscribe();
                });
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

    public clear() {
        this.amount = null;
        this.toaddr = '';
    }
}
