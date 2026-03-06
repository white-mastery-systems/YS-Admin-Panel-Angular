import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationSetupComponent } from './notification-setup.component';

const routes: Routes = [{ path: "", component: NotificationSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NotificationSetupRoutingModule { }