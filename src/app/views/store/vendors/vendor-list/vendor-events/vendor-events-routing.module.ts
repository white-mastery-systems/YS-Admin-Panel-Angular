import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorEventsComponent } from './vendor-events.component';

const routes: Routes = [{ path: "", component: VendorEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorEventsRoutingModule { }