import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { WalletBackupComponent, AssetDetailComponent } from '../../../pages';
import { InfiniteScroll, NavController, Refresher, AlertController, } from 'ionic-angular';
import { WalletService } from '../../../neo';
import { GlobalService } from '../../../core';


@Component({
    selector: 'asset-list',
    templateUrl: 'list.component.html'
})
export class AssetListComponent implements OnInit {
    public backupTips: string = '';
    public backupUrl: any = WalletBackupComponent;
    public assetList: any = [];
    public assetListValue: any = [];
    public page: number = 1;
    public address: string = '';
    public enabled: boolean = true;
    public neoValue: number = 0;

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private wallet: WalletService,
        private global: GlobalService,
        private navctrl: NavController,
        private alert: AlertController
    ) { }

    public ngOnInit() {
        this.wallet.Wallet().subscribe((res) => {
            this.address = this.wallet.GetAddressFromWIF(res.wif);
            this.http.post(this.global.apiAddr + '/api/block',
                { 'method': 'getaddressasset', 'params': [this.address] }).subscribe(result => {
                    if ( result['result']['AddrAsset'] === undefined ) {
                        this.global.Alert('REQUESTFAILED');
                        return;
                    }
                    this.assetListValue = result['result']['AddrAsset'];
                    for (let j = 0; j < this.assetListValue.length; j++) {
                        if (this.assetListValue[j].name === 'NEO') {
                            this.neoValue = this.assetListValue[j].balance;
                        }
                    }
                    this.getAssetList();
                }, (err) => {
                    this.global.Alert('REQUESTFAILED');
                });
        });
    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(this.page);
                this.page += 1;
                this.getAssetList();
                infiniteScroll.complete();
            }, 500);
        });
    }
    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.page = 1;
            this.enabled = true;
            this.assetList = [];
            this.assetListValue = [];
            this.getAssetList();
            refresher.complete();
        }, 500);
    }

    public getAssetList() {
        this.http.post(this.global.apiAddr + '/api/block',
            { 'method': 'getassets', 'params': [this.page, 5] }).subscribe(res => {
                if ( res['result']['data'] === undefined ) {
                    this.global.Alert('REQUESTFAILED');
                    return;
                }
                const temp = res['result']['data'];
                for (let i = 0; i < temp.length; i++) {
                    for (let j = 0; j < this.assetListValue.length; j++) {
                        if (temp[i].assetId === this.assetListValue[j].assetId) {
                            temp[i].value = this.assetListValue[j].balance;
                        }
                    }
                    if (!temp[i].value) {
                        temp[i].value = 0;
                    }
                    this.assetList.push(temp[i]);
                }
                if (temp.length <= 0) {
                    this.enabled = false;
                }
            }, (err) => {
                this.global.Alert('REQUESTFAILED');
            });
    }

    public jumpDetail(token: string, name: string) {
        // this.navctrl.push(AssetDetailComponent, {
        //     token: token,
        //     name: name
        // });
        this.alert.create({subTitle: 'Coming soon'}).present();
    }
    public addAsset() {
        this.alert.create({subTitle: 'Coming soon'}).present();
    }
}
