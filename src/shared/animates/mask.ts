import { animate, AnimationMetadata, state, style, transition, trigger } from '@angular/animations';

// Component transition animations
export const mask: AnimationMetadata =
trigger('mask', [
    state('on', style({opacity: 0.3})),
    state('off', style({opacity: 0})),
    state('void', style({opacity: 0})),
    transition('* => *', animate('0.3s linear'))
]);
