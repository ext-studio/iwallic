import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'pager',
    templateUrl: 'pager.component.html'
})
export class PagerComponent {
    @Input() public nomore: boolean = true;
    @Input() public loading: boolean = false;
    @Output() public next: EventEmitter<any> = new EventEmitter();
    public jumpNext() {
        if (!this.nomore) {
            this.next.emit();
        }
    }
}
