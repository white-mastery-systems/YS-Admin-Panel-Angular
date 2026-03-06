import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestUsersComponent } from './guest-users.component';

const routes: Routes = [
  { path: "", component: GuestUsersComponent },
  { path: ':id', loadChildren: () => import('./guest-user-details/guest-user-details.module').then(m => m.GuestUserDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GuestUsersRoutingModule { }