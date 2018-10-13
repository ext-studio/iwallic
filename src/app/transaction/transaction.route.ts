import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferComponent } from './transfer/transfer.component';
import { ReceiveComponent } from './receive/receive.component';

const routes: Routes = [
    { path: 'transaction', component: ReceiveComponent },
    { path: 'transaction/receive', component: ReceiveComponent },
    { path: 'transaction/transfer', component: TransferComponent },
    { path: 'transaction/**', component: ReceiveComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
