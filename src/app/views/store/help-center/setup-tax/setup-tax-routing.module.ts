import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupTaxComponent } from './setup-tax.component';
const routes: Routes = [
  {path:'', component:SetupTaxComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupTaxRoutingModule { }
