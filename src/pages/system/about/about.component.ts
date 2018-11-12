import { Component, OnInit } from '@angular/core';
import { GlobalService, HttpService } from '../../../core';

@Component({
    selector: 'system-about',
    templateUrl: 'about.component.html'
})
export class SystemAboutComponent implements OnInit {
    constructor(
        private global: GlobalService,
        private http: HttpService
    ) { }

    public ngOnInit() {}
    public disclaimer() {
        const disclaimer = this.http._config.disclaimer;
        if (disclaimer && disclaimer.action === 'link' && disclaimer.enabled && disclaimer.data) {
            this.global.browser(disclaimer.data, 'THEMEABLE');
        } else {
            this.global.ToastI18N('APP_COMING').subscribe();
        }
    }
}
