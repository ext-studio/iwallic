import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferComponent } from './transfer/transfer.component';
import { ReceiveComponent } from './receive/receive.component';
import { ListComponent } from './list/list.component';
import { UnconfirmedComponent } from './unconfirmed/unconfirmed.component';
import { WalletGuard } from 'app/neo';

const routes: Routes = [
    { path: 'transaction', component: ReceiveComponent, canActivate: [WalletGuard] },
    { path: 'transaction/receive', component: ReceiveComponent, canActivate: [WalletGuard] },
    { path: 'transaction/transfer', component: TransferComponent, canActivate: [WalletGuard] },
    { path: 'transaction/list', component: ListComponent, canActivate: [WalletGuard] },
    { path: 'transaction/unconfirmed', component: UnconfirmedComponent, canActivate: [WalletGuard] },
    { path: 'transaction/**', component: ReceiveComponent, canActivate: [WalletGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
