import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupPaymentRoutingModule } from './setup-payment-routing.module';
import { SetupPaymentComponent } from './setup-payment.component';


@NgModule({
  declarations: [SetupPaymentComponent],
  imports: [
    CommonModule,
    SetupPaymentRoutingModule
  ]
})
export class SetupPaymentModule { }
