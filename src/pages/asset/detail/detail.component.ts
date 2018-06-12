import { Component, OnInit } from '@angular/core';
import {
    NavController, NavParams,
    Refresher, Platform, ItemSliding
} from 'ionic-angular';
import { TxReceiptComponent, TxTransferComponent } from '../../../pages';
import { WalletService } from '../../../neo';
import { TransactionState, BalanceState, GlobalService, NetService, ConfigService } from '../../../core';
import { Clipboard } from '@ionic-native/clipboard';
import {
    ThemeableBrowser, ThemeableBrowserOptions
} from '@ionic-native/themeable-browser';

const options: ThemeableBrowserOptions = {
    statusbar: {
        color: '#ffffffff'
    },
    toolbar: {
        height: 44,
        color: '#f0f0f0ff'
    },
    title: {
        color: '#003264ff',
        showPageTitle: true
    },
    closeButton: {
        wwwImage: '/assets/icon/close.png',
        align: 'left',
        wwwImageDensity: 2
    },
    backButtonCanClose: true
};

@Component({
    selector: 'asset-detail',
    templateUrl: 'detail.component.html',
    providers: [TransactionState]
})
export class AssetDetailComponent implements OnInit {
    public items: any = [];
    public receipt = TxReceiptComponent;
    public transfer = TxTransferComponent;
    public token: string;
    public assetSymbol: string;
    public assetBalance: number = 0;
    public address: string;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private platform: Platform,
        private wallet: WalletService,
        private transcation: TransactionState,
        private balanceState: BalanceState,
        private clipboard: Clipboard,
        private global: GlobalService,
        private themeableBrowser: ThemeableBrowser,
        private net: NetService,
        private config: ConfigService
    ) {}
    public ngOnInit() {
        this.token = this.navParams.get('token');
        this.assetSymbol = this.navParams.get('symbol');
        this.balanceState.get(this.wallet.address).subscribe((res) => {
            const value = res.find((e) => e.assetId === this.token);
            this.assetBalance = value ? value.balance : this.navParams.get('assetBalance');
        });
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.transcation.get(wal.address, this.token).subscribe((res) => {
                this.items = res;
            });
        });
    }

    public loadMore() {
        return this.transcation.fetch(true);
    }

    public jumpTx() {
        if (this.assetBalance <= 0) {
            this.global.AlertI18N({
                title: 'ALERT_TITLE_TIP',
                content: 'ALERT_CONTENT_NOBALANCE',
                no: 'ALERT_NO_CANCEL'
            }).subscribe();
            return;
        }
        this.navCtrl.push(TxTransferComponent, {asset: this.token});
    }

    public doRefresh(refresher: Refresher) {
        setTimeout(() => {
            this.transcation.fetch().then(() => {
                refresher.complete();
            });
        }, 500);
    }

    public copyTx(txid: string, item: ItemSliding) {
        this.global.Copy(txid).then((res) => {
            if (res) {
                this.global.ToastI18N('TOAST_CONTENT_COPIED').subscribe();
                item.close();
            }
        });
    }

    public browse(txid: string) {
        if (this.net.current === 'Main') {
            const b = this.themeableBrowser.create(this.config.get().browser.tx + txid, '_blank', options);
        }
    }
}
