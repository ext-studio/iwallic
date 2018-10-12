import {
    Directive, Input, OnChanges, SimpleChanges,
    ElementRef, Pipe, PipeTransform, ViewChildren
} from '@angular/core';
import { ThemeService } from '../services/theme';
import { Observable } from 'rxjs';

const skin = {
    light: {
        light:      '#ffffff',
        dark:       '#000000',
        primary:    '#558aef',
        secondary:  '#32db64',
        danger:     '#f53d3d',
        default:    '#f9f9f9',
        default2:   '#ffffff',
        line:       '#eeedee',
        line2:      '#cccaca',
        font:       'rgba(28, 27, 46, 0.85)',
        font2:      '#c6c6c6',
        font3:      '#8a8789',
    },
    dark: {
        light:      '#ffffff',
        dark:       '#000000',
        primary:    '#5581d5',
        secondary:  '#3e8fad',
        danger:     '#b95858',
        default:    '#282939',
        default2:   '#333448',
        line:       '#55566a',
        line2:      '#dfedf2',
        font:       'rgba(255, 255, 255, 0.85)',
        font2:      '#9398b2',
        font3:      '#595e79',
    }
};

@Directive({
    selector: '[icolor]'
})
export class IColorDirective implements OnChanges {
    private skin: string;
    @Input() public icolor: string;
    constructor(
        private elemRef: ElementRef,
        private theme: ThemeService
    ) {
        this.theme.get().subscribe((res) => {
            this.skin = res;
            if (skin[this.skin]) {
                this.elemRef.nativeElement.style.color = skin[this.skin][this.icolor];
            }
        });
    }
    public ngOnChanges(changes: SimpleChanges) {
        if (
            changes.icolor &&
            changes.icolor.previousValue !== changes.icolor.currentValue &&
            skin[this.skin]
        ) {
            this.elemRef.nativeElement.style.color = skin[this.skin][changes.icolor.currentValue];
        }
    }
}

@Directive({
    selector: '[ibg]'
})
export class IBgDirective implements OnChanges {
    private skin: string;
    @Input() public ibg: string;
    constructor(
        private elemRef: ElementRef,
        private theme: ThemeService
    ) {
        this.theme.get().subscribe((res) => {
            this.skin = res;
            if (skin[this.skin]) {
                this.elemRef.nativeElement.style.backgroundColor = skin[this.skin][this.ibg];
            }
        });
    }
    public ngOnChanges(changes: SimpleChanges) {
        if (
            changes.ibg &&
            changes.ibg.previousValue !== changes.ibg.currentValue &&
            skin[this.skin]
        ) {
            this.elemRef.nativeElement.style.backgroundColor = skin[this.skin][changes.ibg.currentValue];
        }
    }
}

@Directive({
    selector: '[iborder]'
})
export class IBorderDirective implements OnChanges {
    private skin: string;
    @Input() public iborder: string;
    @ViewChildren('[class.item-inner]') public vChildren: any;
    constructor(
        private elemRef: ElementRef,
        private theme: ThemeService
    ) {
        this.theme.get().subscribe((res) => {
            this.skin = res;
            if (skin[this.skin]) {
                this.elemRef.nativeElement.style.borderColor = skin[this.skin][this.iborder];
            }
        });
    }
    public ngOnChanges(changes: SimpleChanges) {
        if (
            changes.iborder &&
            changes.iborder.previousValue !== changes.iborder.currentValue &&
            skin[this.skin]
        ) {
            this.elemRef.nativeElement.style.borderColor = skin[this.skin][changes.iborder.currentValue];
        }
    }
}

@Directive({
    selector: '[isrc]'
})
export class ISrcDirective implements OnChanges {
    private skin: string;
    @Input() public isrc: string;
    constructor(
        private elemRef: ElementRef,
        private theme: ThemeService
    ) {
        this.theme.get().subscribe((res) => {
            this.skin = res;
            if (this.isrc) {
                this.elemRef.nativeElement.src = this.solveSrc(res, this.isrc);
            }
        });
    }
    public ngOnChanges(changes: SimpleChanges) {
        if (
            changes.isrc &&
            changes.isrc.previousValue !== changes.isrc.currentValue &&
            this.skin
        ) {
            this.elemRef.nativeElement.src = this.solveSrc(this.skin, changes.isrc.currentValue);
        }
    }
    private solveSrc(theme: string, src: string): string {
        const index = src.lastIndexOf('/') + 1;
        return src.slice(0, index) + theme + '.' + src.slice(index);
    }
}

@Pipe({
    name: 'isrc'
})
export class ISrcPipe implements PipeTransform {
    constructor(
        private theme: ThemeService
    ) {}
    public transform(value: string): any {
        const index = value.lastIndexOf('/') + 1;
        return this.theme.get().map(((res) => value.slice(0, index) + res + '.' + value.slice(index))).startWith('/');
    }
}

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'theme'
})
export class ThemePipe implements PipeTransform {
    constructor(
        private theme: ThemeService
    ) {}
    public transform(value: string): any {
        return this.theme.get().map((res) => `${res}-${value}`);
    }
}

@Pipe({
    name: 'img'
})
export class ImgPipe implements PipeTransform {
    constructor(
        private theme: ThemeService
    ) {}
    public transform(value: Observable<string>): any {
        return this.theme.get().map((res => `${res}.${value}`));
    }
}