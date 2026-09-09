import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorSettlementRoutingModule } from './vendor-settlement-routing.module';
import { VendorSettlementComponent } from './vendor-settlement.component';

@NgModule({
  declarations: [VendorSettlementComponent],
  imports: [
    SharedModule,
    BsDatepickerModule,
    VendorSettlementRoutingModule
  ]
})

export class VendorSettlementModule { }