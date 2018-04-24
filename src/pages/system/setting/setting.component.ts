import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    public lang = 'en';
    public theme = 'default';
    constructor() { }

    public ngOnInit() { }
}
