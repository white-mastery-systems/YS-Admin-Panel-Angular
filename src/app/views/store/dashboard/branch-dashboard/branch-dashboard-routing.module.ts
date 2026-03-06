import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchDashboardComponent } from './branch-dashboard.component';

const routes: Routes = [{ path: "", component: BranchDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BranchDashboardRoutingModule { }