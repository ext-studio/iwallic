import { Component, OnInit } from '@angular/core';
import { Refresher, ItemSliding } from 'ionic-angular';
import { GlobalService, TransactionState, ConfigService } from '../../../core';
import { WalletService } from '../../../neo';
import {
    ThemeableBrowser, ThemeableBrowserOptions
} from '@ionic-native/themeable-browser';

const options: ThemeableBrowserOptions = {
    statusbar: {
        color: '#f3f3f3ff'
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
    selector: 'transaction-list',
    templateUrl: 'list.component.html'
})
export class TxListComponent implements OnInit {
    public items: any[] = [];
    public address: string = '';

    constructor(
        private global: GlobalService,
        private wallet: WalletService,
        public transcation: TransactionState,
        private themeableBrowser: ThemeableBrowser,
        private config: ConfigService
    ) { }

    public ngOnInit() {
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.transcation.get(wal.address).subscribe((res: any[]) => {
                this.items = res;
            });
        });
    }

    public loadMore() {
        return this.transcation.fetch(true);
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
        if (this.config.current === 'Main') {
            const b = this.themeableBrowser.create(`https://blolys.com/#/transaction/${txid}`, '_blank', options);
            b.insertCss({code: 'html {background: #f3f3f3;} body {margin-top: 44px;}'});
        }
    }
}
