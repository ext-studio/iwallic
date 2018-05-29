import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavParams, NavController, IonicTapInput } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'popup-input',
    templateUrl: 'popup-input.component.html'
})
export class PopupInputComponent implements OnInit {
    @ViewChild('pwdInput') public pwdInput: IonicTapInput;
    public pwd: string;
    private $enter: Subject<any>;
    constructor(
        private params: NavParams,
        private nav: NavController
    ) { }

    public ngOnInit() {
        this.$enter = this.params.get('subject');
        setTimeout(() => {
            this.pwdInput.initFocus();
        }, 500);
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
