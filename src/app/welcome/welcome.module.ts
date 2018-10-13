import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { GuideComponent } from './guide/guide.component';
import { WelcomeRoutingModule } from './welcome.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeRoutingModule
  ],
  declarations: [
    IndexComponent,
    GuideComponent
  ]
})
export class WelcomeModule { }
