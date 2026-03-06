import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';

const routes: Routes = [
  { path: '', component: VendorListComponent },
  // { path: 'add', loadChildren: () => import('./vendor-events/vendor-events.module').then(m => m.VendorEventsModule) },
  { path: 'modify/:vendor_id', loadChildren: () => import('./vendor-events/vendor-events.module').then(m => m.VendorEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorListRoutingModule { }