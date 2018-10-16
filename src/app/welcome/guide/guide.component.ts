import { Component } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Storage } from '@ionic/storage';


@Component({
    templateUrl: 'guide.component.html',
    styleUrls: ['./guide.component.scss']
})
export class GuideComponent {

    showSkip = true;
    constructor(
        private router: Router,
        public storage: Storage
    ) {}

    startApp() {
        this.router
            .navigateByUrl('/asset', {replaceUrl: true})
            .then(() => this.storage.set('ion_did_tutorial', 'true'));
    }

    onSlideChangeStart(event) {
        event.target.isEnd().then(isEnd => {
            this.showSkip = !isEnd;
        });
    }

    ionViewWillEnter() {
        this.storage.get('ion_did_tutorial').then(res => {
            if (res === 'true') {
                this.router.navigateByUrl('/wallet', {replaceUrl: true});
            }
        });
    }
}
