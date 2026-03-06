import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YsNotificationEventsComponent } from './ys-notification-events.component';

const routes: Routes = [{ path: "", component: YsNotificationEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsNotificationEventsRoutingModule { }