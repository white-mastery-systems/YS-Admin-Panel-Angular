import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { MeasurementEventsRoutingModule } from './measurement-events-routing.module';
import { MeasurementEventsComponent } from './measurement-events.component';

@NgModule({
  declarations: [MeasurementEventsComponent],
  imports: [
    SharedModule,
    MeasurementEventsRoutingModule
  ]
})

export class MeasurementEventsModule { }