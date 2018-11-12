import { Component, OnInit } from '@angular/core';
import { GlobalService, HttpService } from '../../../core';

@Component({
    selector: 'system-helper',
    templateUrl: 'helper.component.html'
})
export class SystemHelperComponent implements OnInit {
    private helpers: any;
    private browsers: any;
    constructor(
        private global: GlobalService,
        private http: HttpService
    ) { }

    public ngOnInit() {
        this.helpers = this.http._config.helpers;
        this.browsers = this.http._config.browser;
    }
    public wallet() {
        const walletguide = this.helpers && this.helpers.walletguide;
        if (walletguide && walletguide.action === 'link' && walletguide.enabled && walletguide.data) {
            this.global.browser(walletguide.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public transaction() {
        const transactionguide = this.helpers && this.helpers.transactionguide;
        if (transactionguide && transactionguide.action === 'link' && transactionguide.enabled && transactionguide.data) {
            this.global.browser(transactionguide.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }

    public browser() {
        if (this.browsers && this.browsers.action === 'link' && this.browsers.enabled && this.browsers.data) {
            this.global.browser(this.browsers.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public community() {
        const community = this.helpers && this.helpers.community;
        if (community && community.action === 'link' && community.enabled && community.data) {
            this.global.browser(community.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public contact() {
        const contact = this.helpers && this.helpers.contact;
        if (contact && contact.action === 'email' && contact.enabled && contact.data) {
            //
        }
    }
}
