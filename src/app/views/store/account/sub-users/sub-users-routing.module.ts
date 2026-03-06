import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubUsersComponent } from './sub-users.component';
import { PermissionGuard } from '../../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: SubUsersComponent },
  { path: 'roles', loadChildren: () => import('./user-roles/user-roles.module').then(m => m.UserRolesModule), canActivate: [PermissionGuard], data: { name: "user_roles" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SubUsersRoutingModule { }