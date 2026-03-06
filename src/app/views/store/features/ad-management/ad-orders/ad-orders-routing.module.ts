import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdOrdersComponent } from './ad-orders.component';

const routes: Routes = [{ path: '', component: AdOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdOrdersRoutingModule { }