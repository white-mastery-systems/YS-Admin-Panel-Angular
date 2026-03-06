import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YsNotificationsComponent } from './ys-notifications.component';

const routes: Routes = [
  { path: "", component: YsNotificationsComponent },
  { path: 'add', loadChildren: () => import('./ys-notification-events/ys-notification-events.module').then(m => m.YsNotificationEventsModule) },
  { path: 'update/:id', loadChildren: () => import('./ys-notification-events/ys-notification-events.module').then(m => m.YsNotificationEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsNotificationsRoutingModule { }