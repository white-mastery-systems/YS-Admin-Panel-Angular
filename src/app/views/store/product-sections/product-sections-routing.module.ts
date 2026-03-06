import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSectionsComponent } from './product-sections.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: ProductSectionsComponent },
  { path: 'catalogs', loadChildren: () => import('../catalogs/catalogs.module').then(m => m.CatalogsModule), canActivate: [PermissionGuard], data: { name: "catalogs" } },
  { path: 'products', loadChildren: () => import('../products/products.module').then(m => m.ProductModule) },
  { path: 'archive', loadChildren: () => import('../product-extras/archive/archive.module').then(m => m.ArchiveModule), canActivate: [PermissionGuard], data: { name: "product_archive" } },
  { path: 'extras', loadChildren: () => import('../product-extras/product-extras.module').then(m => m.ProductExtrasModule) },
  { path: 'reviews', loadChildren: () => import('../features/product-reviews/product-reviews.module').then(m => m.ProductReviewsModule), canActivate: [PermissionGuard], data: { name: "product_reviews" } },
  { path: 'selected-product-reviews/:id', loadChildren: () => import('../features/product-reviews/review-details/review-details.module').then(m => m.ReviewDetailsModule), canActivate: [PermissionGuard], data: { name: "product_reviews" } }
];

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ProductSectionsComponent, children: routes }])],
  exports: [RouterModule]
})

export class ProductSectionsRoutingModule { }