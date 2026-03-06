import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupUsersComponent } from './signup-users.component';
import { PermissionGuard } from '../../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: SignupUsersComponent },
  { path: ':id', loadChildren: () => import('./signup-user-details/signup-user-details.module').then(m => m.SignupUserDetailsModule) },
  { path: ':id/rewards', loadChildren: () => import('./reward-history/reward-history.module').then(m => m.RewardHistoryModule), canActivate: [PermissionGuard], data: { name: "reward_history" } },
  { path: ':id/:model_id', loadChildren: () => import('./model-history/model-history.module').then(m => m.ModelHistoryModule), canActivate: [PermissionGuard], data: { name: "custom_model_history" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SignupUsersRoutingModule { }