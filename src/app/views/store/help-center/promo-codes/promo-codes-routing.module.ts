import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromoCodesComponent } from './promo-codes.component';
const routes: Routes = [
  {path:'', component:PromoCodesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoCodesRoutingModule { }
