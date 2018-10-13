import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
    { path: 'asset', component: ListComponent },
    { path: 'asset/list', component: ListComponent },
    { path: 'asset/detail', component: DetailComponent },
    { path: 'asset/**', component: ListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetRoutingModule { }
