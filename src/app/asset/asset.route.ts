import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { ManageComponent } from './manage/manage.component';
import { WalletGuard } from '../neo';

const routes: Routes = [
    { path: 'asset', component: ListComponent, canActivate: [WalletGuard] },
    { path: 'asset/list', component: ListComponent, canActivate: [WalletGuard] },
    { path: 'asset/detail', component: DetailComponent, canActivate: [WalletGuard] },
    { path: 'asset/manage', component: ManageComponent, canActivate: [WalletGuard] },
    { path: 'asset/**', component: ListComponent, canActivate: [WalletGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetRoutingModule { }
