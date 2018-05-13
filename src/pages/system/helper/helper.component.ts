import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../core';

@Component({
    selector: 'system-helper',
    templateUrl: 'helper.component.html'
})
export class SystemHelperComponent implements OnInit {
    constructor(
        private global: GlobalService
    ) { }

    public ngOnInit() { }
    public wallet() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public transaction() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public community() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
    public contact() {
        this.global.ToastI18N('APP_COMING').subscribe();
    }
}
