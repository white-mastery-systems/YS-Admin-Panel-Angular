import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'list', loadChildren: () => import('./vendor-list/vendor-list.module').then(m => m.VendorListModule), canActivate: [PermissionGuard], data: { name: "vendors" } },
  { path: 'payments', loadChildren: () => import('./vendor-payments/vendor-payments.module').then(m => m.VendorPaymentsModule), canActivate: [PermissionGuard], data: { name: "vendor_subs" } },
  { path: 'settlement', loadChildren: () => import('./vendor-settlement/vendor-settlement.module').then(m => m.VendorSettlementModule), canActivate: [PermissionGuard], data: { name: "vendor_settlement" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorsRoutingModule { }