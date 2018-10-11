import { Component, OnInit } from '@angular/core';
import {
    AssetDetailComponent,
    TxReceiptComponent, TxTransferComponent, AssetAttachComponent
} from '../../../pages';
import {
    NavController, Refresher,
    MenuController
} from 'ionic-angular';
import { WalletService, TransactionService } from '../../../neo';
import { GlobalService, BalanceState, ConfigService, HttpService } from '../../../core';

@Component({
    selector: 'asset-list',
    templateUrl: 'list.component.html'
})
export class AssetListComponent implements OnInit {
    public assets: any[] = [];
    public claim: any;
    public neoValue: number = 0;
    public receipt: any = TxReceiptComponent;
    public isRefresh: boolean = true;
    public claimGasBalance: number = 0;
    public selectedNet: 'main' | 'test' | 'priv';
    public online: boolean = true;
    private claimLoading: boolean = false;
    constructor(
        private http: HttpService,
        public wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        public balance: BalanceState,
        private config: ConfigService,
        private tx: TransactionService,
        private menu: MenuController
    ) {}

    public ngOnInit() {
        this.selectedNet = this.config.currentNet;
        this.balance.get(this.wallet.address).subscribe((res) => {
            this.assets = res;
            const neo = res.find((e) => e.name === 'NEO');
            this.neoValue = neo ? neo.balance : 0;
            if (this.balance.unconfirmedClaim) {
                this.checkClaim(this.balance.unconfirmedClaim);
            } else if (this.neoValue > 0) {
                if (!this.claimLoading) {
                    this.fetchClaim();
                }
            }
        });
        this.balance.error().subscribe((res) => {
            this.global.Error(res).subscribe();
        });
        this.config.$net().subscribe((online) => {
            if (!this.online && online) {
                this.online = online;
                this.selectedNet = this.config.currentNet;
            } else {
                this.online = online;
            }
        });
        this.menu.swipeEnable(true, 'iwallic-menu');
    }

    public doRefresh(refresher: Refresher) {
        this.isRefresh = false;
        setTimeout(() => {
            this.balance.fetch().then(() => {
                refresher.complete();
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
        if (this.assets.find((e) => e.balance > 0)) {
            this.navctrl.push(TxTransferComponent);
            return;
        }
         this.global.AlertI18N({
                title: 'ALERT_TITLE_TIP',
                content: 'ALERT_CONTENT_NOBALANCE',
                no: 'ALERT_NO_CANCEL'
            }).subscribe();
    }

    public addAsset() {
        this.navctrl.push(AssetAttachComponent);
    }

    public claimGas() {
        this.global.LoadI18N('LOADING_CLAIMGAS').subscribe((load) => {
            this.tx.ClaimGAS(this.claim, this.wallet.wif).subscribe((res) => {
                load.dismiss();
                // this.txState.push('GAS', res.txid, res.value, true);
                this.balance.unconfirmedClaim = res.txid;
                this.claim.unSpentClaim = 0;
                // call for new claim
                // when new NEO spent, update again
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_TIP',
                    content: 'ALERT_CONTENT_ClAIMESUCCESS',
                    ok: 'ALERT_OK_SURE'
                }).subscribe();
            }, (err) => {
                load.dismiss();
                this.global.Error(err).subscribe();
                // console.log(err);
                // this.global.AlertI18N({
                //     title: 'ALERT_TITLE_WARN',
                //     content: 'ALERT_CONTENT_CLAIMFAILED',
                //     ok: 'ALERT_OK_SURE'
                // }).subscribe();
            });
        });
    }

    private fetchClaim() {
        this.claimLoading = true;
        this.http.post(`${this.global.apiDomain}/api/iwallic`, {
            method: 'getclaim',
            params: [this.wallet.address]
        }).subscribe((res: any) => {
            res.unSpentClaim = parseFloat(res.unSpentClaim) || 0;
            this.claim = res;
            this.claimLoading = false;
        }, (err) => {
            console.log(err);
            this.claimLoading = false;
        });
    }

    private checkClaim(txid: string) {
        if (txid.length === 64) {
            txid = '0x' + txid;
        }
        this.http.post(`${this.global.apiDomain}/api/transactions`, {
            method: 'gettxbytxid',
            params: [txid]
        }).subscribe(() => {
            this.balance.unconfirmedClaim = undefined;
            this.fetchClaim();
        }, (err) => {
            console.log(err);
        });
    }
}
