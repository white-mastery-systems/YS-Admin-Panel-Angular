import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingMethodsComponent } from './shipping-methods.component';
import { PermissionGuard } from '../../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: ShippingMethodsComponent },
  { path: 'courier-partners', loadChildren: () => import('../../courier-partners/courier-partners.module').then(m => m.CourierPartnersModule), canActivate: [PermissionGuard], data: { name: "courier_partners" } },
  { path: 'pincodes', loadChildren: () => import('../../shipping/pincodes/pincodes.module').then(m => m.PincodesModule), canActivate: [PermissionGuard], data: { name: "pincodes" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShippingMethodsRoutingModule { }