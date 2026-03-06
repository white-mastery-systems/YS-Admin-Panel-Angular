import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourierPartnersComponent } from './courier-partners.component';

const routes: Routes = [{ path: '', component: CourierPartnersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CourierPartnersRoutingModule { }