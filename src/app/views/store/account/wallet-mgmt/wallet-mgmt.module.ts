import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { WalletMgmtRoutingModule } from './wallet-mgmt-routing.module';
import { WalletMgmtComponent } from './wallet-mgmt.component';

@NgModule({
  declarations: [
    WalletMgmtComponent
  ],
  imports: [
    SharedModule,
    BsDatepickerModule.forRoot(),
    WalletMgmtRoutingModule
  ]
})

export class WalletMgmtModule { }