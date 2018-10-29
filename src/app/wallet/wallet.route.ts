import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackupComponent } from './backup/backup.component';
import { CreateComponent } from './create/create.component';
import { GateComponent } from './gate/gate.component';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { WalletGuard, NoWalletGuard } from '../neo';

const routes: Routes = [
    { path: 'wallet', component: GateComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/gate', component: GateComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/create', component: CreateComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/import', component: ImportComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/backup', component: BackupComponent, canActivate: [WalletGuard] },
    { path: 'wallet/list', component: ListComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/new', component: NewComponent, canActivate: [NoWalletGuard] },
    { path: 'wallet/**', component: GateComponent, canActivate: [NoWalletGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WalletRoutingModule {}
