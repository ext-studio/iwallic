import { Injectable, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { PopupInputComponent } from '../../shared';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class InputRef {
    private component: ComponentRef<PopupInputComponent>;
    private $input: Subject<string> = new Subject<string>();
    constructor(
        comp: ComponentRef<PopupInputComponent>
    ) {
        this.component = comp;
        // newPopupInput
        this.component.instance.finish.subscribe((res) => {
            this.$input.next(res);
            this.component.destroy();
        });
        this.component.instance.cancel.subscribe(() => {
            this.component.destroy();
        });
    }
    public afterClose(): Observable<any> {
        return this.$input.asObservable();
    }
}

@Injectable()
export class PopupInputService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) { }
    public open(
        view: ViewContainerRef
    ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PopupInputComponent);
        const newPopupInput = view.createComponent(componentFactory);
        return new InputRef(newPopupInput);
    }
}
