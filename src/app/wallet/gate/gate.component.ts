import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';

@Component({
    templateUrl: 'gate.component.html',
    styleUrls: ['./gate.component.scss']
})
export class GateComponent {
    constructor(
        private router: Router
    ) {}

    public import() {
        this.router.navigateByUrl('/wallet/import');
    }
    public create() {
        this.router.navigateByUrl('/wallet/create');
    }
}
