import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdMgmtEventsRoutingModule } from './ad-mgmt-events-routing.module';
import { AdMgmtEventsComponent } from './ad-mgmt-events.component';

@NgModule({
  declarations: [
    AdMgmtEventsComponent
  ],
  imports: [
    SharedModule,
    BsDatepickerModule,
    AdMgmtEventsRoutingModule
  ]
})

export class AdMgmtEventsModule { }