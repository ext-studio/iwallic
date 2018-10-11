import { Component, OnInit } from '@angular/core';
import { PopupInputService, GlobalService, BalanceState, ScannerService } from '../../../core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { WalletService, TransactionService } from '../../../neo';
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
        private balanceState: BalanceState,
        private platform: Platform,
        private scanner: ScannerService,
        private params: NavParams
    ) { }

    public ngOnInit() {
        if (this.platform.is('mobileweb') || this.platform.is('core')) {
            this.isScan = false;
        }
        this.getAssets();
    }

    public assetChange() {
        if (!this.asset) {
            return;
        }
        const asset = this.assetList.find((e) => e.assetId === this.asset);
        this.assetBalance = asset && asset.balance;
        this.assetSymbol = asset && asset.symbol;
    }

    public enterPwd() {
        if (!this.w.CheckAddress(this.toaddr)) {
            this.wrongTips = 'TRANSACTION_TRANSFER_WRONGADDRESS';
            return;
        }
        if (typeof this.amount === 'string' && this.amount !== '') {
            this.amount = parseFloat(this.amount);
        }
        if (this.amount && this.amount > 0) {
            if (this.amount > this.assetBalance) {
                this.wrongTips = 'TRANSACTION_TRANSFER_EXCEEDETBALANCE';
                return;
            }
        } else if (this.amount < 0 || isNaN(this.amount)) {
            this.wrongTips = 'TRANSACTION_TRANSFER_AMOUNTWRONG';
            return;
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
                            this.navCtrl.pop({
                                animate: false
                            });
                            this.navCtrl.push(TxSuccessComponent);
                            return;
                        }, (err) => {
                            transferLoad.dismiss();
                            switch (err) {
                                case 1011:
                                this.global.ToastI18N('ERROR_TIMEOUT').subscribe();
                                break;
                                case 1012:
                                this.global.ToastI18N('ERROR_CONNREFUSED').subscribe();
                                break;
                                case 99997:
                                this.global.ToastI18N('ERROR_OFFLINE').subscribe();
                                break;
                                default:
                                this.global.Error(err).subscribe();
                                break;
                            }
                        });
                    });
                }, (werr) => {
                    load.dismiss();
                    if (werr === 99987) {
                        this.global.Alert('WRONGPWD').subscribe();
                    } else {
                        this.global.Error(werr).subscribe();
                    }
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

    public getAssets() {
        this.asset = this.params.get('asset') || null;
        this.balanceState.get().subscribe((res) => {
            this.assetList = [];
            for (let i = 0; i < res.length; i++) {
                if (res[i]['balance'] > 0) {
                    this.assetList.push(res[i]);
                }
            }
            if (this.asset) {
                const preChosen = res.find((e) => e.assetId === this.asset);
                this.assetBalance = parseFloat(preChosen && preChosen.balance || 0);
                this.assetSymbol = preChosen && preChosen.symbol;
            } else {
                this.assetBalance = 0;
            }
        });
    }
}
