import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../shared/shared.module';

import { NotificationSetupRoutingModule } from './notification-setup-routing.module';
import { NotificationSetupComponent } from './notification-setup.component';

@NgModule({
  declarations: [
    NotificationSetupComponent
  ],
  imports: [
    SharedModule,
    AmazingTimePickerModule,
    NotificationSetupRoutingModule
  ]
})

export class NotificationSetupModule { }