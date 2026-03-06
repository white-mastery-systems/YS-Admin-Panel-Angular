import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupPaymentComponent } from './setup-payment.component';
const routes: Routes = [
  {path:'', component:SetupPaymentComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupPaymentRoutingModule { }
