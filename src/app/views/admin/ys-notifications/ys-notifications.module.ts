import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsNotificationsRoutingModule } from './ys-notifications-routing.module';
import { YsNotificationsComponent } from './ys-notifications.component';

@NgModule({
  declarations: [
    YsNotificationsComponent
  ],
  imports: [
    SharedModule,
    YsNotificationsRoutingModule
  ]
})

export class YsNotificationsModule { }