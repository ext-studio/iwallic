import { Component, OnInit } from '@angular/core';
import { DialogService, GlobalService } from '../../core';
import { Wallet, WalletService } from '../../neo';
import { wallet } from '@cityofzion/neon-js';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
        private global: GlobalService,
        private menuCtrl: MenuController
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
            if (confirm) {
                this.wallet.save(Wallet.fromKey(this.key, wallet.getPublicKeyFromPrivateKey(wallet.getPrivateKeyFromWIF(this.wif))));
                this.menuCtrl.enable(true);
                this.router.navigateByUrl('/asset');
            }
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
