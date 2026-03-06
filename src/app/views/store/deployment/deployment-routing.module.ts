import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'plans', loadChildren: () => import('./deploy-packages/deploy-packages.module').then(m => m.DeployPackagesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeploymentRoutingModule { }