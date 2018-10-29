import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Location }  from '@angular/common';
import { WalletService } from '../../neo';
import { DialogService } from '../../core';
import { wallet } from '@cityofzion/neon-js';
import { Platform, MenuController } from '@ionic/angular';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';


@Component({
    templateUrl: 'import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent {
    public wif: string;
    public pwd: string;
    public rePwd: string;
    public isScan: boolean = true;
    constructor(
        private router: Router,
        private wallet: WalletService,
        private scanner: QRScanner,
        private platform: Platform,
        private dialog: DialogService
    ) { }

    public ngOnInit() {
        if (!this.platform.is('ios')) {
            this.isScan = false;
        }
    }
    public import() {
        if (!this.check() || !this.checkWIF()) {
            return;
        }
        this.dialog.loader('Importing').then((loader) => {
            this.wallet.nep2(this.pwd, this.wif).subscribe((res) => {
                loader.dismiss();
                this.wallet.save(res);
                this.router.navigateByUrl('/asset');
            }, (err) => {
                loader.dismiss();
                console.log(err);
                this.dialog.toast(err);
            });
        });
    }
    public fromNEP6() {
        this.dialog.toast('Coming soon');
    }
    public check() {
        return this.pwd && this.pwd.length > 5 && this.pwd === this.rePwd;
    }
    public checkWIF() {
        return this.wif && wallet.isWIF(this.wif);
    }

    public qrScan() {
        this.scanner.scan().subscribe((wif) => {
            if (wif && wallet.isWIF(wif)) {
                this.wif = wif;
            } else {
                this.dialog.toast('No valid WIF key found');
            }
        });
    }
}
