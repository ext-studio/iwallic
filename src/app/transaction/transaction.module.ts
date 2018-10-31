import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { TransferComponent } from './transfer/transfer.component';
import { ReceiveComponent } from './receive/receive.component';
import { ListComponent } from './list/list.component';
import { UnconfirmedComponent } from './unconfirmed/unconfirmed.component';
import { TransactionRoutingModule } from './transaction.route';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TransactionRoutingModule,
        TranslateModule
    ],
    declarations: [
        TransferComponent,
        ReceiveComponent,
        ListComponent,
        UnconfirmedComponent
    ]
})
export class TransactionModule { }
