import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../core';
import { Config } from 'ionic-angular';
import {
    ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject
} from '@ionic-native/themeable-browser';
import { AppVersion } from '@ionic-native/app-version';

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
    constructor(
        private global: GlobalService,
        private themeableBrowser: ThemeableBrowser,
        private http: HttpClient
    ) { }

    public ngOnInit() {
        this.http.get(`https://www.iwallic.com/config/helper.json`).subscribe((res) => {
            console.log(res);
            this.helpers = res;
        });
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
