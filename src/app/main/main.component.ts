import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'main.component.html'
})
export class MainComponent {
    constructor(
        private router: Router
    ) {}
    public goto(path: string) {
        this.router.navigateByUrl(path);
    }
}
