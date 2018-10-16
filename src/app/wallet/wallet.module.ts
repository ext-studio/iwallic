import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { BackupComponent } from './backup/backup.component';
import { CreateComponent } from './create/create.component';
import { GateComponent } from './gate/gate.component';
import { ImportComponent } from './import/import.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { WalletRoutingModule } from './wallet.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletRoutingModule,
    TranslateModule
  ],
  declarations: [
    BackupComponent,
    CreateComponent,
    GateComponent,
    ImportComponent,
    ListComponent,
    NewComponent
  ]
})
export class WalletModule { }
