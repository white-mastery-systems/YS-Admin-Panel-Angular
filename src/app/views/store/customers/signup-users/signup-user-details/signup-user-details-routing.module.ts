import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupUserDetailsComponent } from './signup-user-details.component';

const routes: Routes = [{ path: "", component: SignupUserDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SignupUserDetailsRoutingModule { }