import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreConfigComponent } from './store-config.component';

const routes: Routes = [{ path: "", component: StoreConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreConfigRoutingModule { }