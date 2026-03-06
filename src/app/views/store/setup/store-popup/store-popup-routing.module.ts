import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorePopupComponent } from './store-popup.component';

const routes: Routes = [{ path: "", component: StorePopupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StorePopupRoutingModule { }