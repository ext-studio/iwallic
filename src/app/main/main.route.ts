import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionComponent } from './transaction/transaction.component';
import { BlockComponent } from './block/block.component';
import { UserComponent } from './user/user.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
        {
            path: '',
            redirectTo: '/main/(asset:asset)',
            pathMatch: 'full'
        },
        // tab one
        
        {
            path: 'transaction',
            component: TransactionComponent,
            outlet: 'transaction'
        },
        // tab two
        {
            path: 'block',
            component: BlockComponent,
            outlet: 'block'
        },
        {
            path: 'user',
            component: UserComponent,
            outlet: 'user'
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
