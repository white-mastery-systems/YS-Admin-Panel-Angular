import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsPackagesComponent } from './ys-packages.component';

const routes: Routes = [
  { path: '', component: YsPackagesComponent },
  { path: 'add', loadChildren: () => import('./modify-ys-packages/modify-ys-packages.module').then(m => m.ModifyYsPackagesModule) },
  { path: 'update/:id', loadChildren: () => import('./modify-ys-packages/modify-ys-packages.module').then(m => m.ModifyYsPackagesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsPackagesRoutingModule { }