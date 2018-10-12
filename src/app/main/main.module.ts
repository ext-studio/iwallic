import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main.route';

import { MainTransactionModule } from './transaction/transaction.module';
import { MainBlockModule } from './block/block.module';
import { MainUserModule } from './user/user.module';

@NgModule({
  imports: [
    MainRoutingModule,
    CommonModule,
    IonicModule,
    MainTransactionModule,
    MainBlockModule,
    MainUserModule
  ],
  declarations: [
    MainComponent
  ]
})
export class MainModule { }
