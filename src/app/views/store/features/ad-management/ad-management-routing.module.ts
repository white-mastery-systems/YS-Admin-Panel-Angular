import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdManagementComponent } from './ad-management.component';

const routes: Routes = [
  { path: "", component: AdManagementComponent },
  { path: 'orders', loadChildren: () => import('./ad-orders/ad-orders.module').then(m => m.AdOrdersModule) },
  { path: ':id', loadChildren: () => import('./ad-mgmt-events/ad-mgmt-events.module').then(m => m.AdMgmtEventsModule) },
  { path: 'book/:id', loadChildren: () => import('./ad-details/ad-details.module').then(m => m.AdDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdManagementRoutingModule { }