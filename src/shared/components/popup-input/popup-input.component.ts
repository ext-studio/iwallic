import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { flyUp } from '../../animates/fly';
import { mask } from '../../animates/mask';

@Component({
    selector: 'popup-input',
    templateUrl: 'popup-input.component.html',
    animations: [
        flyUp, mask
    ]
})
export class PopupInputComponent implements OnInit {
    public type = 'ENTER';
    public open = 'on';
    public pwd: string;
    public animationStateChange = new EventEmitter<AnimationEvent>();
    @Output() public finish = new EventEmitter<string>();
    constructor(
        private vcRef: ViewContainerRef
    ) { }

    public ngOnInit() {}
    public startClose(fromFinish?: boolean) {
        this.open = 'off';
        setTimeout(() => {
            if (fromFinish) {
                this.finish.emit(this.pwd);
            } else {
                this.finish.emit(null);
            }
        }, 300);
    }

    public confirm() {
        this.startClose(true);
    }

    public cancel() {
        this.startClose();
    }
}
