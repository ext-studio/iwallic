import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { PopupInputService, GlobalService, TransactionState, BalanceState, ScannerService } from '../../../core';
import { NavController, Platform } from 'ionic-angular';
import { WalletService, TransactionService, Wallet } from '../../../neo';
import { TxSuccessComponent } from '../../../pages';

@Component({
    selector: 'transaction-transfer',
    templateUrl: 'transfer.component.html',
})
export class TxTransferComponent implements OnInit {
    public isfocus: boolean = false;
    public toaddr: string = '';
    public amount: number;
    public asset: string;
    public assetSymbol: string;
    public assetBalance: number = 0;
    public wrongTips: string = '';
    public isNEP5: boolean = true;
    public assetList: any[] = [];
    public isScan: boolean = true;
    constructor(
        private input: PopupInputService,
        private global: GlobalService,
        private navCtrl: NavController,
        private tx: TransactionService,
        private w: WalletService,
        private txState: TransactionState,
        private balanceState: BalanceState,
        private platform: Platform,
        private scanner: ScannerService
    ) { }

    public ngOnInit() {
        if (this.platform.is('mobileweb') || this.platform.is('core')) {
            this.isScan = false;
        }
        this.balanceState.get(this.w.address).subscribe((res) => {
            this.assetList = res;
            const value = res.find((e) => e.assetId === this.asset);
            this.assetBalance = value ? value.balance : 0;
        });
    }

    public assetChange() {
        this.assetBalance = this.assetList.find((e) => e.assetId === this.asset).balance;
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
        this.input.open(this.navCtrl).subscribe((pwd) => {
            if (!pwd) {
                return;
            }
            this.global.LoadI18N('LOADING_VERIFY').subscribe((load) => {
                this.w.Verify(pwd, null, true).subscribe((wres) => {
                    load.dismiss();
                    this.global.LoadI18N('LOADING_TRANSFER').subscribe((transferLoad) => {
                        if (this.asset.length > 42) {
                            this.isNEP5 = false;
                        }
                        this.tx.Send(
                            this.w.address,
                            this.toaddr,
                            this.amount,
                            this.w.wif,
                            this.asset,
                            this.isNEP5
                        ).subscribe((xres) => {
                            transferLoad.dismiss();
                            this.txState.push(this.assetSymbol, xres.txid, xres.value);
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
        this.scanner.open(this.navCtrl, 'ADDRESS').subscribe((res) => {
            if (res) {
                this.toaddr = res;
            }
        });
    }

    public clear() {
        this.amount = null;
        this.toaddr = '';
    }

    public clearAmount() {
        this.amount = null;
    }
}
