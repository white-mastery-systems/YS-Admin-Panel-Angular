import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { YsFeedbacksRoutingModule } from './ys-feedbacks-routing.module';
import { YsFeedbacksComponent } from './ys-feedbacks.component';

@NgModule({
  declarations: [
    YsFeedbacksComponent
  ],
  imports: [
    SharedModule,
    BsDatepickerModule,
    YsFeedbacksRoutingModule
  ]
})

export class YsFeedbacksModule { }