import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerEnquiriesComponent } from './customer-enquiries.component';

const routes: Routes = [{ path: "", component: CustomerEnquiriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CustomerEnquiriesRoutingModule { }