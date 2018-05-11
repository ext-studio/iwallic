import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { WalletBackupComponent, AssetDetailComponent, TxReceiptComponent } from '../../../pages';
import { InfiniteScroll, NavController, Refresher, AlertController, Platform } from 'ionic-angular';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';
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
    public loading: boolean = true;
    constructor(
        private http: HttpClient,
        private storage: Storage,
        private wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        private alert: AlertController,
        private platform: Platform
    ) { }

    public ionViewDidEnter() {
        this.storage.get('wallet').then((res) => {
            this.backuped = (!res['backup']);
        });
    }

    public ngOnInit() {
        this.wallet.Get().subscribe((res) => {
            this.address = res.account.address;
            this.getAssetList();
        });
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.getAssetList();
            refresher.complete();
        }, 500);
    }

    public getAssetList() {
        this.http.post(this.global.apiDomain + '/api/iwallic',
            { 'method': 'getaddrassets', 'params': [this.address] }).subscribe(res => {
                this.loading = false;
                if (res['result'] === undefined) {
                    this.global.Alert('REQUESTFAILED').subscribe();
                    return;
                }
                this.assetList = res['result'];
                if (this.assetList) {
                    for (let i = 0; i < this.assetList.length; i++) {
                        if (this.assetList[i]['name'] === 'NEO') {
                            this.neoValue = this.assetList[i]['balance'];
                        }
                    }
                }
            }, (err) => {
                this.global.Alert('REQUESTFAILED').subscribe();
            });
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
