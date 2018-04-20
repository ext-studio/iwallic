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
    public result: number[] = [];
    public animationStateChange = new EventEmitter<AnimationEvent>();
    @Output() public finish = new EventEmitter<string>();
    @Output() public cancel = new EventEmitter<any>();
    constructor(
        private vcRef: ViewContainerRef
    ) { }

    public ngOnInit() {}
    public enter(num: number) {
        this.result.push(num);
        if (this.result.length >= 6) {
            this.startClose(true);
        }
    }
    public backspace() {
        this.result.splice(-1);
    }
    public startClose(fromFinish?: boolean) {
        this.open = 'off';
        setTimeout(() => {
            if (fromFinish) {
                this.finish.emit(this.result.join(''));
            } else {
                this.cancel.emit();
            }
        }, 300);
    }
}
