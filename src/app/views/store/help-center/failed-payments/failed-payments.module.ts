import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FailedPaymentsRoutingModule } from './failed-payments-routing.module';
import { FailedPaymentsComponent } from './failed-payments.component';


@NgModule({
  declarations: [FailedPaymentsComponent],
  imports: [
    CommonModule,
    FailedPaymentsRoutingModule
  ]
})
export class FailedPaymentsModule { }
