import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { AssetRoutingModule } from './asset.route';
import { AssetComponent } from './asset.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssetRoutingModule
  ],
  declarations: [
    AssetComponent,
    ListComponent,
    DetailComponent
  ]
})
export class AssetModule { }
