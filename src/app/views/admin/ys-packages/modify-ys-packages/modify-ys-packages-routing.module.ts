import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyYsPackagesComponent } from './modify-ys-packages.component';

const routes: Routes = [{ path: "", component: ModifyYsPackagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyYsPackagesRoutingModule { }