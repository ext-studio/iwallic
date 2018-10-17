import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../neo';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListComponent {
    constructor(
        private router: Router,
        private wallet: WalletService
    ) {}

    go() {
        this.router.navigateByUrl('/transaction/transfer');
    }
    exit() {
        this.wallet.close();
        this.router.navigateByUrl('wallet', {replaceUrl: true});
    }
}
