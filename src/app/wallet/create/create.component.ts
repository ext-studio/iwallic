import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { DialogService } from '../../core';
import { WalletService } from '../../neo';

@Component({
    templateUrl: 'create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent {
    public pwd: string;
    public rePwd: string;
    constructor(
        private router: Router,
        private dialog: DialogService,
        private wallet: WalletService
    ) { }

    public ngOnInit() {
        //
    }
    public async create() {
        if (!this.check()) {
            return;
        }
        const loader = await this.dialog.loader('Creating');
        this.wallet.create(this.pwd).subscribe((w) => {
            this.router.navigate(['/wallet/new'], {
                queryParams: w
            });
            loader.dismiss();
        }, (err) => {
            this.dialog.toast(err);
            loader.dismiss();
        });
    }
    public check() {
        return this.pwd && this.pwd.length > 5 && this.pwd === this.rePwd;
    }
}
