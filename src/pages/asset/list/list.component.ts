import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { WalletBackupComponent, AssetDetailComponent, TxReceiptComponent } from '../../../pages';
import { InfiniteScroll, NavController, Refresher, AlertController, Platform } from 'ionic-angular';
import { WalletService, Wallet } from '../../../neo';
import { GlobalService, BalanceState } from '../../../core';
import { ValueTransformer } from '@angular/compiler/src/util';


@Component({
    selector: 'asset-list',
    templateUrl: 'list.component.html'
})
export class AssetListComponent implements OnInit {
    public assetList: any = [];
    public address: string = '';
    public neoValue: number = 0;
    public backuped: boolean = false;
    public receipt: any = TxReceiptComponent;
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        private alert: AlertController,
        public balance: BalanceState
    ) { }

    public ngOnInit() {
        this.wallet.Get().subscribe((wal: Wallet) => {
            this.backuped = wal.backup;
            this.address = wal.address;
            this.balance.get(this.address).subscribe((res) => {
                this.resolveAssetList(res);
            });
            this.balance.error().subscribe((res) => {
                this.global.Alert('REQUESTFAILED').subscribe();
            });
        });
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.balance.fetch().then(() => {
                refresher.complete();
            });
        }, 500);
    }

    public resolveAssetList(list: any[]) {
        this.assetList = list;
        for (let i = 0; i < this.assetList.length; i++) {
            if (this.assetList[i]['name'] === 'NEO') {
                this.neoValue = this.assetList[i]['balance'];
            }
        }
    }

    public jumpDetail(token: string, name: string, value: number) {
        this.navctrl.push(AssetDetailComponent, {
            token: token,
            name: name,
            assetBalance: value
        });
    }

    public addAsset() {
        this.alert.create({ subTitle: 'Coming soon' }).present();
    }

    public walletBackup() {
        this.navctrl.push(WalletBackupComponent);
    }
}
