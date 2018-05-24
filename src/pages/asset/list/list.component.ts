import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { WalletBackupComponent, AssetDetailComponent,
    TxReceiptComponent, TxTransferComponent, AssetAttachComponent } from '../../../pages';
import { InfiniteScroll, NavController, Refresher, AlertController, Platform } from 'ionic-angular';
import { WalletService, Wallet } from '../../../neo';
import { GlobalService, BalanceState, NetService } from '../../../core';
import { ValueTransformer } from '@angular/compiler/src/util';
import { attachEmbeddedView } from '@angular/core/src/view';

import Neon, { api } from '@cityofzion/neon-js';


@Component({
    selector: 'asset-list',
    templateUrl: 'list.component.html'
})
export class AssetListComponent implements OnInit {
    public assetList: any[] = [];
    public address: string = '';
    public neoValue: number = 0;
    public backuped: boolean = false;
    public receipt: any = TxReceiptComponent;
    public isRefresh: boolean = true;
    public isloading: boolean = true;
    public selectedNet: 'Main' | 'Test' | 'Priv' = this.net.current;
    public claimGasBalance: number = 0;
    constructor(
        private http: HttpClient,
        private storage: Storage,
        public wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        private alert: AlertController,
        public balance: BalanceState,
        private net: NetService
    ) {}

    public ngOnInit() {
        // Neon.get.claims('MainNet', this.wallet.address).then((res) => {
        //     console.log(res.claims);
        // });
        // api.neonDB.getMaxClaimAmount('MainNet', this.wallet.address).then((res) => {
        //     console.log(res);
        // });
        this.balance.get(this.wallet.address).subscribe((res) => {
            this.resolveAssetList(res);
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

    public resolveAssetList(list: any[]) {
        this.assetList = list;
        const neo = list.find((e) => e.name === 'NEO');
        this.neoValue = neo ? neo.balance : 0;
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

    public walletBackup() {
        this.navctrl.push(WalletBackupComponent);
    }

    public claimGas() {
        return;
    }
}
