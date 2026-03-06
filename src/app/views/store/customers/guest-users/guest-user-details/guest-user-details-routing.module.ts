import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestUserDetailsComponent } from './guest-user-details.component';

const routes: Routes = [{ path: "", component: GuestUserDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GuestUserDetailsRoutingModule { }