import { Component, OnInit } from '@angular/core';
import { Translate } from '../../../core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    private oldLang: string = 'sys';
    public lang = 'sys';
    public theme = 'default';
    constructor(
        private trans: Translate,
        private nav: NavController
    ) { }

    public ngOnInit() {
        this.trans.Current().subscribe((res) => {
            console.log(res);
            this.oldLang = this.lang = res;
        });
    }
    public langChange() {
        if (this.oldLang !== this.lang) {
            this.trans.Switch(this.lang);
        }
    }
}
