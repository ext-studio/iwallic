import { Component, OnInit, ViewChild } from '@angular/core';
import { Translate, GlobalService } from '../../../core';
import { NavController, Select } from 'ionic-angular';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    private oldLang: string = 'sys';
    public lang = 'sys';
    public theme = 'default';
    @ViewChild(Select) public select: Select;
    constructor(
        private trans: Translate,
        private nav: NavController,
        private global: GlobalService
    ) { }

    public ngOnInit() {
        this.trans.Current().subscribe((res) => {
            console.log(res);
            this.oldLang = this.lang = res;
        });
        setInterval(() => {
            console.log(this.select.isFocus());
        }, 1000);
    }
    public langChange() {
        if (this.oldLang !== this.lang) {
            this.trans.Switch(this.lang);
        }
    }
    public ionViewWillLeave() {
        this.select.close();
    }
}
