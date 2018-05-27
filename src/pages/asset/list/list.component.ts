import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import {
    WalletBackupComponent, AssetDetailComponent,
    TxReceiptComponent, TxTransferComponent, AssetAttachComponent,
    TxSuccessComponent
} from '../../../pages';
import { InfiniteScroll, NavController, Refresher, AlertController, Platform } from 'ionic-angular';
import { WalletService, Wallet, TransactionService } from '../../../neo';
import { GlobalService, BalanceState, NetService, TransactionState } from '../../../core';
import { ValueTransformer } from '@angular/compiler/src/util';
import { attachEmbeddedView } from '@angular/core/src/view';

import Neon, { api } from '@cityofzion/neon-js';


@Component({
    selector: 'asset-list',
    templateUrl: 'list.component.html'
})
export class AssetListComponent implements OnInit {
    public assets: any[] = [];
    public claim: any;
    public neoValue: number = 0;
    // public backuped: boolean = false;
    public receipt: any = TxReceiptComponent;
    public isRefresh: boolean = true;
    public isloading: boolean = true;
    public claimGasBalance: number = 0;
    public selectedNet: 'Main' | 'Test' | 'Priv';
    constructor(
        private http: HttpClient,
        public wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        public balance: BalanceState,
        private net: NetService,
        private tx: TransactionService,
        private txState: TransactionState
    ) {}

    public ngOnInit() {
        this.selectedNet = this.net.current;
        this.balance.get(this.wallet.address).subscribe((res) => {
            this.assets = res;
            const neo = res.find((e) => e.name === 'NEO');
            this.neoValue = neo ? neo.balance : 0;
            // this.checkClaim('0x3691d90256c4f55f26bf6c23c4a12dec1bde00b0e54b76f2938f4687d3df0245');
            // fetch only when has NEO & has not unconfirmed claim
            if (this.balance.unconfirmedClaim) {
                this.checkClaim(this.balance.unconfirmedClaim);
            } else if (this.neoValue > 0) {
                this.fetchClaim();
            }
        });
        this.balance.error().subscribe((res) => {
            this.global.Alert('REQUESTFAILED').subscribe();
        });
    }

    public doRefresh(refresher: Refresher) {
        this.isRefresh = false;
        setTimeout(() => {
            this.isloading = false;
            this.balance.fetch().then(() => {
                refresher.complete();
                this.isloading = true;
                this.isRefresh = true;
            });
        }, 500);
    }

    public jumpDetail(token: string, symbol: string, value: number) {
        this.navctrl.push(AssetDetailComponent, {
            token: token,
            symbol: symbol,
            assetBalance: value
        });
    }

    public jumpTransfer() {
        this.navctrl.push(TxTransferComponent);
        return;
    }

    public addAsset() {
        this.navctrl.push(AssetAttachComponent);
    }

    // public walletBackup() {
    //     this.navctrl.push(WalletBackupComponent);
    // }

    public claimGas() {
        this.global.LoadI18N('LOADING_TRANSFER').subscribe((load) => {
            this.tx.ClaimGAS(this.claim, this.wallet.wif).subscribe((res) => {
                load.dismiss();
                console.log(res);
                this.txState.push('GAS', res.txid, res.value, true);
                this.balance.unconfirmedClaim = res.txid;
                this.claim.unSpentClaim = 0;
                // call for new claim
                // when new NEO spent, update again
                this.navctrl.push(TxSuccessComponent);
            }, (err) => {
                load.dismiss();
                console.log(err);
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_WARN',
                    content: 'ALERT_CONTENT_TXFAILED',
                    ok: 'ALERT_OK_SURE'
                }).subscribe();
            });
        });
    }

    private resolveAssetList(list: any[]) {
        this.assets = list;
        const neo = list.find((e) => e.name === 'NEO');
        this.neoValue = neo ? neo.balance : 0;
        if (this.neoValue > 0) {
            this.fetchClaim();
        }
    }

    private fetchClaim() {
        this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'getclaim',
            params: [this.wallet.address]
        }).map((res: any) => {
            if (res && res.code === 200) {
                return res.result;
            } else {
                throw res.message || 'unknown';
            }
        }).subscribe((res) => {
            res.unSpentClaim = parseFloat(res.unSpentClaim) || 0;
            this.claim = res;
        }, (err) => {
            console.log(err);
        });
    }

    private checkClaim(txid: string) {
        if (txid.length === 64) {
            txid = '0x' + txid;
        }
        this.http.post(`${this.global.apiDomain}/api/transactions`, {
            method: 'gettxbytxid',
            params: [txid]
        }).map((res: any) => {
            if (res && res.code === 200) {
                return res.result;
            } else {
                throw 'not_confirmed';
            }
        }).subscribe((res) => {
            this.balance.unconfirmedClaim = undefined;
            this.fetchClaim();
        }, (err) => {
            console.log(err);
        });
    }
}
