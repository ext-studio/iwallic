import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { BackupComponent } from './backup/backup.component';
import { CreateComponent } from './create/create.component';
import { GateComponent } from './gate/gate.component';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
import { WalletRoutingModule } from './wallet.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletRoutingModule
  ],
  declarations: [
    BackupComponent,
    CreateComponent,
    GateComponent,
    ImportComponent,
    ListComponent
  ]
})
export class WalletModule { }
