import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddonProductsComponent } from './addon-products.component';

const routes: Routes = [
  { path: '', component: AddonProductsComponent },
  { path: 'add/:rank', loadChildren: () => import('./addon-products-events/addon-products-events.module').then(m => m.AddonProductsEventsModule) },
  { path: 'modify/:multi_pro_id/:rank', loadChildren: () => import('./addon-products-events/addon-products-events.module').then(m => m.AddonProductsEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AddonProductsRoutingModule { }