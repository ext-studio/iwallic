import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { AssetListComponent } from '../../asset/list/list.component';
import { WalletVerifyComponent } from '../../wallet/verify/verify.component';
import { WalletGateComponent } from '../../wallet/gate/gate.component';
import { TranslateService, ConfigService, GlobalService } from '../../../core';
import { WalletService } from '../../../neo';

@Component({
    selector: 'system-notify',
    templateUrl: 'notify.component.html'
})
export class SystemNotifyComponent {
    public localConfig: any;
    public lang: string;
    public canSkip: number = 0;
    private willSkip: number;
    constructor(
        private nav: NavController,
        private menu: MenuController,
        private translate: TranslateService,
        private config: ConfigService,
        private wallet: WalletService,
        private global: GlobalService
    ) {
        this.config.Init().subscribe((res) => {
            this.localConfig = res;
            this.config.NetInit();
            this.translate.Init().subscribe((lang) => {
                this.lang = lang;
                this.versionCheck(lang);
            });
            this.walletCheck();
        });
    }

    public skip() {
        if (this.canSkip === 0) {
            return;
        }
        if (this.canSkip === 1) {
            window.clearTimeout(this.willSkip);
            this.menu.enable(true, 'iwallic-menu');
            this.nav.push(AssetListComponent, { animate: true });
            this.nav.remove(0);
            return;
        }
        if (this.canSkip === 2) {
            window.clearTimeout(this.willSkip);
            this.menu.enable(false, 'iwallic-menu');
            this.nav.push(WalletVerifyComponent, { animate: true });
            this.nav.remove(0);
            return;
        }
        if (this.canSkip === 3) {
            window.clearTimeout(this.willSkip);
            this.menu.enable(false, 'iwallic-menu');
            this.nav.push(WalletGateComponent, { animate: true });
            this.nav.remove(0);
            return;
        }
    }

    private walletCheck() {
        this.wallet.Get().subscribe(() => {
            this.willSkip = setTimeout(() => {
                this.menu.enable(true, 'iwallic-menu');
                this.nav.push(AssetListComponent, { animate: true });
                this.nav.remove(0);
            }, this.localConfig.system.welcomedelay);
            this.canSkip = 1;
        }, (err) => {
            console.log(err);
            this.willSkip = setTimeout(() => {
                this.menu.enable(false, 'iwallic-menu');
                if (err === 99981) {
                    this.nav.push(WalletVerifyComponent, { animate: true });
                    this.nav.remove(0);
                } else {
                    this.nav.push(WalletGateComponent, { animate: true });
                    this.nav.remove(0);
                }
            }, this.localConfig.system.welcomedelay);
            this.canSkip = err === 99981 ? 2 : 3;
        });
    }

    private versionCheck(lang: string) {
        this.config.VersionInit().subscribe((version: any) => {
            if (version.curr !== version.latest) {
                this.global.AlertI18N({
                    title: 'ALERT_TITLE_UPGRADE',
                    content: version.info[lang],
                    ok: 'ALERT_OK_UPDATE',
                    no: 'ALERT_NO_CANCEL'
                }).subscribe((confirm) => {
                    if (confirm) {
                        this.global.browser(version.url, 'INAPP');
                    }
                });
            } else {
                console.log('no need');
            }
        }, () => {});
    }
}
