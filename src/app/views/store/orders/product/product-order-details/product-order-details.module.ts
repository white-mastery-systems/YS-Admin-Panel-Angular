import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { ProductOrderDetailsRoutingModule } from './product-order-details-routing.module';
import { ProductOrderDetailsComponent } from './product-order-details.component';

@NgModule({
  declarations: [ProductOrderDetailsComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    ProductOrderDetailsRoutingModule
  ]
})

export class ProductOrderDetailsModule { }