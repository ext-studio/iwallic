import { Component, OnInit } from '@angular/core';
import { Refresher, ItemSliding } from 'ionic-angular';
import { GlobalService, TransactionState, ConfigService } from '../../../core';
import { WalletService } from '../../../neo';

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
        private config: ConfigService
    ) { }

    public ngOnInit() {
        this.wallet.Get().subscribe((wal) => {
            this.address = wal.account.address;
            this.transcation.get(wal.address).subscribe((res: any[]) => {
                this.items = res;
            });
            this.transcation.error().subscribe((err) => {
                this.global.Error(err).subscribe();
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
        if (this.config.currentNet === 'main' && this.config.online) {
            this.global.browser(this.config.get().browser.tx + txid, 'THEMEABLE');
        }
    }
}
