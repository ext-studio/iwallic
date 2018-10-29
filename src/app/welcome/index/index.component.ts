import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { WalletService }  from '../../neo';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    constructor(
        private router: Router,
        private storage: Storage,
        private wallet: WalletService
    ) {
        /**
         * if first enter jump to guide page directly
         * or goto wallet or asset page delay
         * or touch to skip delay
         */
        this.storage.get('ion_did_tutorial').then((res) => {
            if (res !== 'true') {
                this.router.navigateByUrl('/welcome/guide', {replaceUrl: true});
            } else {
                setTimeout(() => {
                    this.resolveWallet();
                }, 1000);
            }
        }).catch(() => {
            setTimeout(() => {
                this.resolveWallet();
            }, 1000);
        });
    }

    private resolveWallet() {
        this.wallet.init().subscribe(() => {
            this.router.navigateByUrl('/asset', {replaceUrl: true});
        }, () => {
            this.router.navigateByUrl('/wallet', {replaceUrl: true});
        });
    }
}
