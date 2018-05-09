import { Component, OnInit } from '@angular/core';
import { Translate } from '../../../core';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    public lang = 'sys';
    public theme = 'default';
    constructor(
        private trans: Translate
    ) { }

    public ngOnInit() {
        this.trans.Current().subscribe((res) => {
            console.log(res);
            this.lang = res;
        });
    }
    public langChange() {
        if (this.lang !== 'sys') {
            this.trans.Switch(this.lang);
        }
    }
}
