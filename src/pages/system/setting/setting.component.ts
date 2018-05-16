import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, GlobalService, ThemeService } from '../../../core';
import { NavController, Select } from 'ionic-angular';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    private oldLang: string = 'sys';
    public lang = 'sys';
    public selectedTheme: String = this.themeService.default;
    @ViewChild(Select) public select: Select;
    constructor(
        private translate: TranslateService,
        private nav: NavController,
        private global: GlobalService,
        private themeService: ThemeService
    ) {
        this.themeService.get().subscribe(val => this.selectedTheme = val);
    }

    public ngOnInit() {
        this.translate.Current().subscribe((res) => {
            this.oldLang = this.lang = res;
        });
    }
    public langChange() {
        if (this.oldLang !== this.lang) {
            this.translate.Switch(this.lang);
        }
    }
    public ionViewWillLeave() {
        this.select.close();
    }
    public toggleAppTheme() {
        if (this.selectedTheme === 'dark') {
            this.themeService.set('dark');
        } else {
            this.themeService.set(this.themeService.default);
        }
    }
}
