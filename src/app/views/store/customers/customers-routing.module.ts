import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';

let abandRoutes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'companies', loadChildren: () => import('./../account/companies/companies.module').then(m => m.CompaniesModule) },
  { path: 'signup-user', loadChildren: () => import('./signup-users/signup-users.module').then(m => m.SignupUsersModule) },
  { path: 'guest-user', loadChildren: () => import('./guest-users/guest-users.module').then(m => m.GuestUsersModule) }
];

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: CustomersComponent, children: abandRoutes }])],
  exports: [RouterModule]
})

export class CustomersRoutingModule { }