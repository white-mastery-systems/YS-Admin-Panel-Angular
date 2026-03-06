import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreBranchesComponent } from './store-branches.component';

const routes: Routes = [{ path: "", component: StoreBranchesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreBranchesRoutingModule { }