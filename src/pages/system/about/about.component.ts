import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core';

@Component({
    selector: 'system-about',
    templateUrl: 'about.component.html'
})
export class SystemAboutComponent implements OnInit {
    constructor(
        private global: GlobalService
    ) { }

    public ngOnInit() { }
    public checkVersion() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public disclaimer() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
}
