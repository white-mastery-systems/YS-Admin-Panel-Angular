import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { AdManagementRoutingModule } from './ad-management-routing.module';
import { AdManagementComponent } from './ad-management.component';

@NgModule({
  declarations: [AdManagementComponent],
  imports: [
    SharedModule,
    AdManagementRoutingModule,
    AmazingTimePickerModule,
    BsDatepickerModule.forRoot()
  ]
})

export class AdManagementModule { }