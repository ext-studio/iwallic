import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core';
import { WalletService } from '../../../neo';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'asset-attach',
    templateUrl: 'attach.component.html'
})
export class AssetAttachComponent implements OnInit {
    public chooseList: any[] = [];
    public assetList: any[] = [];
    public address: string;
    constructor(
        private http: HttpClient,
        private global: GlobalService,
        private wallet: WalletService,
        private storage: Storage,
    ) { }

    public ngOnInit() {
        this.storage.get('MainAssetList').then((res) => {
            if (res) {
                this.chooseList = res;
            } else {
                this.chooseList = [];
            }
        });
        this.address = this.wallet.address;
        this.getAssetList();
        return;
    }

    public changeChoose(event, index) {
        this.storage.set('MainAssetList', this.chooseList);
    }

    public getAssetList() {
        this.http.post(this.global.apiDomain + '/api/iwallic', {
            method: 'getaddrassets',
            params: [this.address, 0]
        }).subscribe((res) => {
            this.assetList = res['result'];
            for (let i = 0; i < this.assetList.length; i++) {
                const token = this.assetList[i].assetId;
                if (!this.chooseList.find((e) => e.assetId === token)) {
                    this.chooseList.push({
                        'assetId': this.assetList[i].assetId,
                        'symbol': this.assetList[i].symbol,
                        'name': this.assetList[i].name
                    });
                }
                this.assetList[i].assetId = token.substring(0, 8) +
                    '...' + token.substring(token.length - 8);
                if (!this.chooseList[i]['choose']) {
                    if (i <= 3) {
                        this.chooseList[i]['choose'] = true;
                    } else {
                        this.chooseList[i]['choose'] = false;
                    }
                }
            }
        }, (err) => {
            this.global.Alert('REQUESTFAILED').subscribe();
        });
        return;
    }
}
