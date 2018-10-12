import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetComponent } from './asset.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
    {
        path: 'asset',
        component: AssetComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'list', component: ListComponent },
            { path: 'detail', component: DetailComponent },
            { path: '**', component: ListComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetRoutingModule {}
