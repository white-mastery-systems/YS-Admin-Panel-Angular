import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorPaymentsComponent } from './vendor-payments.component';

const routes: Routes = [{path:'', component: VendorPaymentsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorPaymentsRoutingModule { }