import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    NgApexchartsModule,
    DashboardRoutingModule,
    BsDatepickerModule
  ],
  providers: [DatePipe]
})

export class DashboardModule { }