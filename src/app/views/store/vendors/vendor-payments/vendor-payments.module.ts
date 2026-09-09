import { NgModule } from '@angular/core';

import { VendorPaymentsRoutingModule } from './vendor-payments-routing.module';
import { VendorPaymentsComponent } from './vendor-payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    VendorPaymentsComponent
  ],
  imports: [
    SharedModule,
    BsDatepickerModule,
    VendorPaymentsRoutingModule
  ]
})
export class VendorPaymentsModule { }
