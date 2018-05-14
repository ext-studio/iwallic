import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';

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
        align: 'left'
    },
    backButtonCanClose: true
};

@Component({
    selector: 'system-helper',
    templateUrl: 'helper.component.html'
})
export class SystemHelperComponent implements OnInit {
    constructor(
        private global: GlobalService,
        private themeableBrowser: ThemeableBrowser
    ) { }

    public ngOnInit() { }
    public wallet() {
        // const browser: ThemeableBrowserObject = this.themeableBrowser.create('https://google.com', '_blank', options);
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public transaction() {
        // const browser: ThemeableBrowserObject = this.themeableBrowser.create('https://github.com', '_blank', options);
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public community() {
        // const browser: ThemeableBrowserObject = this.themeableBrowser.create('https://bilibili.com', '_blank', options);
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public contact() {
        // const browser: ThemeableBrowserObject = this.themeableBrowser.create('https://neo.org', '_blank', options);
    }
}
