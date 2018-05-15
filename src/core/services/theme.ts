import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ThemeService {

    private theme: BehaviorSubject<String>;

    constructor() {
        this.theme = new BehaviorSubject('default-theme');
    }

    public setActiveTheme(val) {
        this.theme.next(val);
    }

    public getActiveTheme() {
        return this.theme.asObservable();
    }

}
