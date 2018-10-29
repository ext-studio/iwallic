import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackupComponent } from './backup/backup.component';
import { CreateComponent } from './create/create.component';
import { GateComponent } from './gate/gate.component';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { WalletGuard } from '../neo';

const routes: Routes = [
    { path: 'wallet', component: GateComponent },
    { path: 'wallet/gate', component: GateComponent },
    { path: 'wallet/create', component: CreateComponent },
    { path: 'wallet/import', component: ImportComponent },
    { path: 'wallet/backup', component: BackupComponent, canActivate: [WalletGuard] },
    { path: 'wallet/list', component: ListComponent },
    { path: 'wallet/new', component: NewComponent },
    { path: 'wallet/**', component: GateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WalletRoutingModule {}
