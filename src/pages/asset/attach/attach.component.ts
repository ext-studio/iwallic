import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'asset-attach',
    templateUrl: 'attach.component.html'
})
export class AssetAttachComponent implements OnInit {
    public chooseList: boolean[] = [false, true];
    constructor() { }

    public ngOnInit() { }

    public changeChoose() {
        console.log(this.chooseList);
    }
}
