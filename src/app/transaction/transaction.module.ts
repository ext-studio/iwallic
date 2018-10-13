import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { TransferComponent } from './transfer/transfer.component';
import { ReceiveComponent } from './receive/receive.component';
import { TransactionRoutingModule } from './transaction.route';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TransactionRoutingModule
    ],
    declarations: [
        TransferComponent,
        ReceiveComponent
    ]
})
export class TransactionModule { }
