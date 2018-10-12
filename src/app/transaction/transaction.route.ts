import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from './transaction.component';
import { TransferComponent } from './transfer/transfer.component';
import { ReceiveComponent } from './receive/receive.component';

const routes: Routes = [
    {
        path: 'transaction',
        component: TransactionComponent,
        children: [
            { path: '', component: ReceiveComponent },
            { path: 'receive', component: ReceiveComponent },
            { path: 'transfer', component: TransferComponent },
            { path: '**', component: ReceiveComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule {}
