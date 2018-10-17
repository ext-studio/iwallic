import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService, ASSET } from '../../neo';
import { BalanceState, DialogService } from '../../core';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
    public neoValue = 99999999;
    public list = [];
    constructor(
        private router: Router,
        private wallet: WalletService,
        private balance: BalanceState,
        private dialog: DialogService
    ) {}

    refresh(event) {
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

    ngOnInit(): void {
        this.balance.listen(this.wallet.address).subscribe((res: any[]) => {
            this.list = res;
            const tryGet = res.find((e) => e.assetId === ASSET.NEO);
            this.neoValue = tryGet && tryGet.balance;
        });
        this.balance.error().subscribe((err) => {
            this.dialog.toast(err);
        });
    }
}
