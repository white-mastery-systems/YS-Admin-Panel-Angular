import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { YsNotificationEventsRoutingModule } from './ys-notification-events-routing.module';
import { YsNotificationEventsComponent } from './ys-notification-events.component';

@NgModule({
  declarations: [
    YsNotificationEventsComponent
  ],
  imports: [
    AmazingTimePickerModule,
    BsDatepickerModule,
    SharedModule,
    YsNotificationEventsRoutingModule
  ]
})

export class YsNotificationEventsModule { }