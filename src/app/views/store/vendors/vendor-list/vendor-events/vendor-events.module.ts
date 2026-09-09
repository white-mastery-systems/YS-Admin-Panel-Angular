import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { VendorEventsRoutingModule } from './vendor-events-routing.module';
import { VendorEventsComponent } from './vendor-events.component';

@NgModule({
  declarations: [
    VendorEventsComponent
  ],
  imports: [
    SharedModule,
    TagInputModule,
    BsDatepickerModule,
    VendorEventsRoutingModule
  ]
})

export class VendorEventsModule { }