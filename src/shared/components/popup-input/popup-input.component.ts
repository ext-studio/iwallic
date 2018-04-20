import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';

@Component({
    templateUrl: 'popup-input.component.html'
})
export class PopupInputComponent implements OnInit {
    @Output() public finish = new EventEmitter<string>();
    @Output() public cancel = new EventEmitter<any>();
    constructor(
        private vcRef: ViewContainerRef
    ) { }

    public ngOnInit() {}
}
