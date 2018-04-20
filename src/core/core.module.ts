import { NgModule } from '@angular/core';
import { GlobalService } from './services/global';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { PopupInputService } from './services/popup-input';

@NgModule({
    imports: [
        IonicStorageModule.forRoot({
            name: '__iwallicdb',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        HttpClientModule
    ],
    exports: [],
    declarations: [],
    providers: [
        GlobalService, PopupInputService
    ]
})
export class CoreModule {}
