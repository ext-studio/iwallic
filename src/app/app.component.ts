import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Events, MenuController, Platform } from '@ionic/angular';

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
        private wallet: WalletService
    ) {
        this.initializeApp();
    }

    ngOnInit() {
      
    }

    initializeApp() {
        this.platform.ready().then(() => {
          
            this.statusBar.styleDefault();
            this.splashScreen.hide();
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
}
