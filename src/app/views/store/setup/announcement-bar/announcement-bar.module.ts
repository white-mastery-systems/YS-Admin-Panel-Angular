import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { AnnouncementBarRoutingModule } from './announcement-bar-routing.module';
import { AnnouncementBarComponent } from './announcement-bar.component';

@NgModule({
  declarations: [AnnouncementBarComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    AnnouncementBarRoutingModule
  ]
})

export class AnnouncementBarModule { }