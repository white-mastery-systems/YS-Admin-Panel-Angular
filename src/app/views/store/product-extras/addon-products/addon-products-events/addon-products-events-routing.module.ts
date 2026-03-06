import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddonProductsEventsComponent } from './addon-products-events.component';

const routes: Routes = [{path:'', component: AddonProductsEventsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AddonProductsEventsRoutingModule { }