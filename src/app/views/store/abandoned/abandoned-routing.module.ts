import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedComponent } from './abandoned.component';

let abandRoutes: Routes = [
  { path: '', component: AbandonedComponent },
  { path: 'customer', loadChildren: () => import('./abandoned-customers/abandoned-customers.module').then(m => m.AbandonedCustomersModule) },
  { path: 'guest-user', loadChildren: () => import('./abandoned-guest-users/abandoned-guest-users.module').then(m => m.AbandonedGuestUsersModule) },
  { path: 'customer/:customer_id', loadChildren: () => import('./abandoned-details/abandoned-details.module').then(m => m.AbandonedDetailsModule) },
  { path: 'guest-user/:customer_id', loadChildren: () => import('./abandoned-details/abandoned-details.module').then(m => m.AbandonedDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AbandonedComponent, children: abandRoutes }])],
  exports: [RouterModule]
})

export class AbandonedRoutingModule { }