import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorWalletMgmtRoutingModule } from './vendor-wallet-mgmt-routing.module';
import { VendorWalletMgmtComponent } from './vendor-wallet-mgmt.component';

@NgModule({
  declarations: [
    VendorWalletMgmtComponent
  ],
  imports: [
    SharedModule,
    VendorWalletMgmtRoutingModule,
    BsDatepickerModule
  ]
})

export class VendorWalletMgmtModule { }