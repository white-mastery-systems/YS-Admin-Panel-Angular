import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: ProductsComponent, canActivate: [PermissionGuard], data: { name: "products" } },
  { path: 'import', loadChildren: () => import('./import-product/import-product.module').then(m => m.ImportProductModule), canActivate: [PermissionGuard], data: { name: "bulk_upload" } },
  { path: 'import/history', loadChildren: () => import('./import-history/import-history.module').then(m => m.ImportHistoryModule), canActivate: [PermissionGuard], data: { name: "bulk_upload" } },
  { path: 'add/:rank', loadChildren: () => import('./add-product/add-product.module').then(m => m.AddProductModule), canActivate: [PermissionGuard], data: { name: "product_add" } },
  { path: 'modify/:product_id/:rank', loadChildren: () => import('./modify-product/modify-product.module').then(m => m.ModifyProductModule), canActivate: [PermissionGuard], data: { name: "product_edit" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule { }