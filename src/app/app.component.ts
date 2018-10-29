import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';

import { DialogService } from './core';
import { WalletService } from './neo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    @HostBinding('class.dark') public themeDark = false;
  
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private router: Router,
        private statusBar: StatusBar,
        private dialog: DialogService,
        private wallet: WalletService,
        private location: Location,
        private menuCtrl: MenuController,
        private aRoute: ActivatedRoute
    ) {
        this.initializeApp();
    }

    ngOnInit() {}

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
                // console.log(event.url, /^(\/asset)(\/list)?/.test(event.url));
                this.menuCtrl.enable(/^(\/asset)(\/list)?/.test(event.url));
            });
        });
    }

    navigate(url: string) {
        return this.router.navigateByUrl(url);
    }

    public signout() {
        this.dialog.confirm('Sure to close wallet and exit?', 'Notice', 'Exit', 'Cancel').then((confirm) => {
            if (confirm) {
                this.wallet.close();
                this.router.navigateByUrl('/wallet', {replaceUrl: true});
            }
        });
    }

    public enter(url: string) {
        this.router.navigate([url], {replaceUrl: /$\/asset[\/list]*/.test(this.location.path())});
        this.menuCtrl.close();
    }
}
