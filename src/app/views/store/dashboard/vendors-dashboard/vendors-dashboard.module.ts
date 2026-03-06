import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

import { VendorsDashboardRoutingModule } from './vendors-dashboard-routing.module';
import { VendorsDashboardComponent } from './vendors-dashboard.component';

@NgModule({
  declarations: [VendorsDashboardComponent],
  imports: [
    SharedModule,
    NgApexchartsModule,
    VendorsDashboardRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class VendorsDashboardModule { }