import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorBillingRoutingModule } from './vendor-billing-routing.module';
import { VendorBillingComponent } from './vendor-billing.component';

@NgModule({
  declarations: [
    VendorBillingComponent
  ],
  imports: [
    SharedModule,
    VendorBillingRoutingModule
  ]
})

export class VendorBillingModule { }