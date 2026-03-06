import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchProfileComponent } from './branch-profile.component';

const routes: Routes = [{ path: "", component: BranchProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BranchProfileRoutingModule { }