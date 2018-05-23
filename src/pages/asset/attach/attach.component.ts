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
    public chooseList: boolean[] = [];
    public assetList: any[] = [];
    private address: string;
    constructor(
        private http: HttpClient,
        private global: GlobalService,
        private wallet: WalletService,
        private storage: Storage
    ) { }

    public ngOnInit() {
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.getAssetList();
        });
        return;
     }

    public changeChoose(event) {
        console.log(event);
        console.log(this.chooseList);
    }

    public getAssetList() {
        this.http.post(this.global.apiDomain + '/api/iwallic', {
            method: 'getaddrassets',
            params: [this.address, 0]
        }).subscribe((res) => {
            for (let i = 0 ; i < res['result'].length; i++) {
                const token = res['result'][i].assetId;
                res['result'][i].assetId = token.substring(0, 8) +
                '...' +
                token.substring(token.length - 8);
                this.chooseList[i] = true;
            }
            this.assetList = res['result'];
        }, (err) => {
            this.global.Alert('REQUESTFAILED').subscribe();
        });
        return;
    }
}
