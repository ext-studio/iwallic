import { Component, OnInit } from '@angular/core';
import { InfiniteScroll, Refresher, Platform, ItemSliding } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService, TransactionState } from '../../../core';
import { WalletService } from '../../../neo';
import { Clipboard } from '@ionic-native/clipboard';
import {
    ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject
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
    selector: 'transaction-list',
    templateUrl: 'list.component.html'
})
export class TxListComponent implements OnInit {
    public items: any[] = [];
    public address: string = '';

    constructor(
        private http: HttpClient,
        private global: GlobalService,
        private wallet: WalletService,
        private platform: Platform,
        public transcation: TransactionState,
        private clipboard: Clipboard,
        private themeableBrowser: ThemeableBrowser
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
        this.clipboard.copy(txid).then((res) => {
            this.global.ToastI18N('TOAST_CONTENT_COPIED').subscribe();
            item.close();
        }, (err) => {
            this.global.ToastI18N('TOAST_CONTENT_COPYFAILED').subscribe();
            item.close();
        });
    }

    public browse(txid: string) {
        const b = this.themeableBrowser.create(`https://blolys.com/#/transaction/${txid}`, '_blank', options);
    }
}
