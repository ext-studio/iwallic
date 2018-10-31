import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService, ASSET, BlockService } from '../../neo';
import { BalanceState, DialogService } from '../../core';
import { Subscription } from 'rxjs';
import { Block } from 'app/neo/models/block';
import { Storage } from '@ionic/storage';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
    public neoValue = 0;
    public list = [];

    private $block: Subscription;
    private $balance: Subscription;
    private $error: Subscription;
    constructor(
        private router: Router,
        private wallet: WalletService,
        private balance: BalanceState,
        private dialog: DialogService,
        private block: BlockService,
        private storage: Storage
    ) {}

    public refresh(event) {
        this.balance.fetch(this.wallet.address).then(() => {
            event.target.complete();
        });
    }

    public jumpDetail(token: string, symbol: string, value: number) {
        this.router.navigate(['/asset/detail'], {
            queryParams: {
                token: token,
                symbol: symbol,
                assetBalance: value
            }
        });
    }

    public manage() {
        this.router.navigate(['/asset/manage']);
    }

    ngOnInit(): void {
        this.$block = this.block.listen().subscribe((res: Block) => {
            console.log(`block ${res.latestHeight} arrived`);
            this.balance.fetchSilent(this.wallet.address);
        });
        this.$balance = this.balance.listen(this.wallet.address).subscribe((res: any[]) => {
            this.list = res;
            this.resolveWatch();
            const tryGet = res.find((e) => e.assetId === ASSET.NEO);
            this.neoValue = tryGet && tryGet.balance || 0;
        });
        this.$error = this.balance.error().subscribe((err) => {
            this.dialog.toast(err);
        });
    }
    ngOnDestroy(): void {
        this.$block.unsubscribe();
        this.$balance.unsubscribe();
        this.$error.unsubscribe();
    }

    private resolveWatch() {
        this.storage.get('asset_watch').then((res) => {
            if (res instanceof Array && res.length) {
                res.forEach((e) => {
                    if (this.list.findIndex((i) => i['asset_id'] == e['asset_id']) < 0) {
                        this.list.push(e);
                    }
                });
            }
        });
    }
}
