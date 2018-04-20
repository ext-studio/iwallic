import { animate, AnimationMetadata, state, style, transition, trigger } from '@angular/animations';

export const flyUp: AnimationMetadata =
trigger('flyUp', [
    state('on', style({
        'opacity': '1',
        'bottom': '0'
    })),
    state('off', style({
        'opacity': '0',
        'bottom': '-100px'
    })),
    state('void', style({
        'opacity': '0',
        'bottom': '-100px'
    })),
    transition('* => *', [animate('0.2s linear')])
]);
