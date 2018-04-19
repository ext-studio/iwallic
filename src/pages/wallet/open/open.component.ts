import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../neo';

@Component({
    templateUrl: 'open.component.html'
})
export class WalletOpenComponent implements OnInit {
    constructor(
        private wallet: WalletService
    ) { }

    public ngOnInit() {
        //
    }
}
