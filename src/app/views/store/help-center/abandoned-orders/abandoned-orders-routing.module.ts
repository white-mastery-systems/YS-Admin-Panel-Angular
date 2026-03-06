import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedOrdersComponent } from './abandoned-orders.component';
const routes: Routes = [
  {path:'', component:AbandonedOrdersComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbandonedOrdersRoutingModule { }
