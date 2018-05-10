import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'popup-input',
    templateUrl: 'popup-input.component.html'
})
export class PopupInputComponent implements OnInit {
    public type = 'ENTER';
    public pwd: string;
    private $enter: Subject<any>;
    constructor(
        private params: NavParams,
        private nav: NavController
    ) { }

    public ngOnInit() {
        this.$enter = this.params.get('subject');
    }

    public confirm() {
        setTimeout(() => {
            this.$enter.next(this.pwd);
            this.$enter.complete();
        }, 400);
        this.nav.pop();
    }

    public cancel() {
        this.nav.pop();
    }
}
