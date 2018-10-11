import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, ThemeService, ConfigService, BalanceState, BlockState } from '../../../core';
import { NavController, Select } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'system-setting',
    templateUrl: 'setting.component.html'
})
export class SystemSettingComponent implements OnInit {
    private oldLang: string = 'sys';
    public lang = 'sys';
    public selectedNet: 'main' | 'test' | 'priv' = this.config.currentNet;
    public selectedTheme: String = this.themeService.default;
    @ViewChild(Select) public select: Select;
    constructor(
        private translate: TranslateService,
        private nav: NavController,
        private themeService: ThemeService,
        private config: ConfigService,
        private statusBar: StatusBar,
        private platform: Platform,
        private block: BlockState,
        private balance: BalanceState
    ) {
        this.themeService.get().subscribe(val => this.selectedTheme = val);
    }

    public ngOnInit() {
        this.translate.Current().subscribe((res) => {
            this.oldLang = this.lang = res;
        });
        this.selectedNet = this.config.currentNet;
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
            if (this.platform.is('ios')) {
                 this.statusBar.styleLightContent();
            }
        } else {
            this.themeService.set(this.themeService.default);
            if (this.platform.is('ios')) {
                this.statusBar.styleDefault();
           }
        }
    }
    public toggleAppNet() {
        this.config.NetSwitch(this.selectedNet);
        this.balance.unconfirmedClaim = undefined;
        this.block.fetch(true);
        setTimeout(() => {
            this.nav.setRoot(AssetListComponent);
        }, 200);
    }
}
