import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementEventsComponent } from './measurement-events.component';

const routes: Routes = [{ path: "", component: MeasurementEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MeasurementEventsRoutingModule { }