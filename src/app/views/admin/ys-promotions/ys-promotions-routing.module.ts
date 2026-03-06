import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsPromotionsComponent } from './ys-promotions.component';

const routes: Routes = [{ path: "", component: YsPromotionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsPromotionsRoutingModule { }