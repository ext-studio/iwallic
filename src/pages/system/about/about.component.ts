import { Component, OnInit } from '@angular/core';
import { GlobalService, ConfigService } from '../../../core';

@Component({
    selector: 'system-about',
    templateUrl: 'about.component.html'
})
export class SystemAboutComponent implements OnInit {
    public ver: any;
    constructor(
        private global: GlobalService,
        private config: ConfigService
    ) { }

    public ngOnInit() {
        this.config.version().subscribe((res) => {
            this.ver = res;
        }, () => {});
    }
    public disclaimer() {
        const disclaimer = this.ver && this.ver.disclaimer;
        if (disclaimer && disclaimer.action === 'link' && disclaimer.enabled && disclaimer.data) {
            this.global.browser(disclaimer.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
}
