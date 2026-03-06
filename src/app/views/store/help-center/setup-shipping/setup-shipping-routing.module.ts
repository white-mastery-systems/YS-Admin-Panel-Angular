import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupShippingComponent } from './setup-shipping.component';
const routes: Routes = [
  {path:'', component:SetupShippingComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupShippingRoutingModule { }
