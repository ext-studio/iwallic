import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location }  from '@angular/common';
import { AlertController, List, LoadingController, ModalController, ToastController } from '@ionic/angular';


@Component({
  selector: 'transaction-transfer',
  templateUrl: 'transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferComponent {
  constructor(
    private router: Router,
    private location: Location
  ) {}

  public go() {
  }
}
