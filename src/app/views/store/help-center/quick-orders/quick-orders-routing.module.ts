import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickOrdersComponent } from './quick-orders.component';
const routes: Routes = [
  {path:'', component:QuickOrdersComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickOrdersRoutingModule { }
