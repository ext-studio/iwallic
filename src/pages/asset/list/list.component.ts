import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { WalletBackupComponent } from '../../../pages';
import { InfiniteScroll } from 'ionic-angular';
import { WalletService } from '../../../neo';


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
        private wallet: WalletService
    ) { }

    public ngOnInit() {
        this.wallet.Wallet().subscribe((res) => {
            this.address = this.wallet.GetAddressFromWIF(res.wif);
            this.http.post('http://192.168.1.39:8080/api/block',
            { 'method': 'getaddressasset', 'params': [this.address] }).subscribe(result => {
                this.assetListValue = result['result']['AddrAsset'];
                for (let j = 0; j < this.assetListValue.length; j++) {
                    if (this.assetListValue[j].name === 'NEO') {
                        this.neoValue = this.assetListValue[j].balance;
                    }
                }
                this.getAssetList();
            });
        });
    }

    public doInfinite(infiniteScroll: InfiniteScroll): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.page += 1;
                this.getAssetList();
                infiniteScroll.complete();
            }, 100);
        });
    }

    public getAssetList() {
        this.http.post('http://192.168.1.39:8080/api/block',
            { 'method': 'getassets', 'params': [this.page, 5] }).subscribe(res => {
                const temp = res['result']['result'];
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
            });
    }

    public sortAsset() {
        return;
    }
}
