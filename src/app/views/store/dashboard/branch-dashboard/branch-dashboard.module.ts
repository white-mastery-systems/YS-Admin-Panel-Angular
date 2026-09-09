import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

import { BranchDashboardRoutingModule } from './branch-dashboard-routing.module';
import { BranchDashboardComponent } from './branch-dashboard.component';

@NgModule({
  declarations: [
    BranchDashboardComponent
  ],
  imports: [
    SharedModule,
    NgApexchartsModule,
    BranchDashboardRoutingModule,
    BsDatepickerModule
  ]
})

export class BranchDashboardModule { }