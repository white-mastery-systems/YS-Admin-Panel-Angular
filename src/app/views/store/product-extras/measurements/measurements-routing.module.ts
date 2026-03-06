import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeasurementsComponent } from './measurements.component';

const routes: Routes = [
  { path: '', component: MeasurementsComponent },
  { path: ':id/:rank', loadChildren: () => import('./measurement-events/measurement-events.module').then(m => m.MeasurementEventsModule) },
  { path: ':id/:rank/:vendor_id', loadChildren: () => import('./measurement-events/measurement-events.module').then(m => m.MeasurementEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MeasurementsRoutingModule { }