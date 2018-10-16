import { Component, OnInit } from '@angular/core';
import { DialogService, GlobalService } from '../../core';
import { Wallet, WalletService } from '../../neo';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
    public shown: boolean = true;
    public newWallet: Wallet;
    public copied: boolean;
    public wif: string;
    public key: string;
    public address: string;
    constructor(
        private wallet: WalletService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private dialog: DialogService,
        private global: GlobalService
    ) {
        
    }

    public copy() {
        this.global.Copy(this.wif).then((res) => {
            if (res) {
                this.copied = true;
            }
        }).catch((err) => {
            this.dialog.toast(err);
        });
    }

    public enter() {
        this.dialog.confirm('Have you backed up your new address and sure to enter wallet?', 'Notice', 'Enter', 'Cancel').then((confirm) => {
             alert(confirm);
        });
    }
    ngOnInit(): void {
        this.aRoute.queryParamMap.subscribe((res) => {
            this.wif = res.get('wif');
            this.address = res.get('address');
            this.key = res.get('key');
            this.global.GenerateQRCode('wallet-qrcode', this.wif, 160, '/assets/images/logo.png');
        });
    }
}
