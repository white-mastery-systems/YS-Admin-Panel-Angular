import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { YsAnnouncementsRoutingModule } from './ys-announcements-routing.module';
import { YsAnnouncementsComponent } from './ys-announcements.component';

@NgModule({
  declarations: [
    YsAnnouncementsComponent
  ],
  imports: [
    AmazingTimePickerModule,
    BsDatepickerModule,
    SharedModule,
    YsAnnouncementsRoutingModule
  ]
})

export class YsAnnouncementsModule { }