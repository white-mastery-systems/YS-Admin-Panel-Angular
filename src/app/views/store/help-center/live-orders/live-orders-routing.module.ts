import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveOrdersComponent } from './live-orders.component';
const routes: Routes = [
  {path:'', component:LiveOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveOrdersRoutingModule { }
