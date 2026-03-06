import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { CustomerEnquiriesRoutingModule } from './customer-enquiries-routing.module';
import { CustomerEnquiriesComponent } from './customer-enquiries.component';

@NgModule({
  declarations: [
    CustomerEnquiriesComponent
  ],
  imports: [
    SharedModule,
    CustomerEnquiriesRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class CustomerEnquiriesModule { }