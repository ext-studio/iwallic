import { Component, OnInit } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AssetListComponent } from '../../../pages';
@Component({
    selector: 'success',
    templateUrl: 'success.component.html',
})
export class TxSuccessComponent implements OnInit {
    constructor(
        private nav: Nav
    ) { }

    public ngOnInit() {}

    public returnRoot() {
        this.nav.setRoot(AssetListComponent);
    }
}
