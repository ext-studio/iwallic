import { Component, OnInit } from '@angular/core';
import { GlobalService, ConfigService } from '../../../core';
import {
    ThemeableBrowser, ThemeableBrowserOptions
} from '@ionic-native/themeable-browser';

const options: ThemeableBrowserOptions = {
    statusbar: {
        color: '#ffffffff'
    },
    toolbar: {
        height: 44,
        color: '#f0f0f0ff'
    },
    title: {
        color: '#003264ff',
        showPageTitle: true
    },
    closeButton: {
        wwwImage: '/assets/icon/close.png',
        align: 'left',
        wwwImageDensity: 2
    },
    backButtonCanClose: true
};

@Component({
    selector: 'system-helper',
    templateUrl: 'helper.component.html'
})
export class SystemHelperComponent implements OnInit {
    private helpers: any;
    private browsers: any;
    constructor(
        private global: GlobalService,
        private themeableBrowser: ThemeableBrowser,
        private config: ConfigService
    ) { }

    public ngOnInit() {
        this.helpers = this.config.get().helpers;
        this.browsers = this.config.get().browser;
    }
    public wallet() {
        const walletGuide = this.helpers && this.helpers.walletGuide;
        if (walletGuide && walletGuide.action === 'link' && walletGuide.enabled && walletGuide.data) {
            const tb = this.themeableBrowser.create(walletGuide.data, '_blank', options);
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public transaction() {
        const txGuide = this.helpers && this.helpers.transactionGuide;
        if (txGuide && txGuide.action === 'link' && txGuide.enabled && txGuide.data) {
            const tb = this.themeableBrowser.create(txGuide.data, '_blank', options);
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }

    public browser() {
        if (this.browsers && this.browsers.action === 'link' && this.browsers.enabled && this.browsers.data) {
            const tb = this.themeableBrowser.create(this.browsers.data, '_blank', options);
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public community() {
        const community = this.helpers && this.helpers.community;
        if (community && community.action === 'link' && community.enabled && community.data) {
            const tb = this.themeableBrowser.create(community.data, '_blank', options);
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
    public contact() {
        const contact = this.helpers && this.helpers.contact;
        if (contact && contact.action === 'email' && contact.enabled && contact.data) {
            //
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
}
