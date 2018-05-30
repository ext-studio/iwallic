import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {
    ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject
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
    selector: 'system-about',
    templateUrl: 'about.component.html'
})
export class SystemAboutComponent implements OnInit {
    public ver: any;
    public verCurr: any;
    constructor(
        private global: GlobalService,
        private version: AppVersion,
        private http: HttpClient,
        private themeableBrowser: ThemeableBrowser,
        private iab: InAppBrowser,
        private platform: Platform
    ) { }

    public ngOnInit() {
        this.version.getVersionNumber().then((ver) => {
            this.verCurr = ver;
            this.http.get(`https://iwallic.com/assets/config/version.json`).subscribe((res: any) => {
                this.ver = res;
                if (res.version !== this.verCurr) {
                    this.global.AlertI18N({
                        title: 'ALERT_TITLE_TIP',
                        content: 'ALERT_CONTENT_NEWVERSION',
                        ok: 'ALERT_OK_UPDATE',
                        no: 'ALERT_NO_CANCEL'
                    }).subscribe((confirm) => {
                        if (confirm) {
                            if (this.platform.is('ios')) {
                                this.iab.create(res.ios, '_system').show();
                            } else if (this.platform.is('android')) {
                                this.iab.create(res.android, '_system').show();
                            }
                        }
                    });
                } else {
                    console.log(`already latest`);
                }
            }, (err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    public disclaimer() {
        const disclaimer = this.ver && this.ver.disclaimer;
        if (disclaimer && disclaimer.action === 'link' && disclaimer.enabled && disclaimer.data) {
            const tb = this.themeableBrowser.create(disclaimer.data, '_blank', options);
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
}
