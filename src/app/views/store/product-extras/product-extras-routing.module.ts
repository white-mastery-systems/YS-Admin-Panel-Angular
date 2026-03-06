import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductExtrasComponent } from './product-extras.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: ProductExtrasComponent },
  { path: 'addons', loadChildren: () => import('./addons/addons.module').then(m => m.AddonsModule), canActivate: [PermissionGuard], data: { name: "addons" } },
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule), canActivate: [PermissionGuard], data: { name: "faq" } },
  { path: 'footnote', loadChildren: () => import('./foot-note/foot-note.module').then(m => m.FootNoteModule), canActivate: [PermissionGuard], data: { name: "foot_note" } },
  { path: 'measurement-sets', loadChildren: () => import('./measurements/measurements.module').then(m => m.MeasurementsModule), canActivate: [PermissionGuard], data: { name: "measurements" } },
  { path: 'size-chart', loadChildren: () => import('./size-chart/size-chart.module').then(m => m.SizeChartModule), canActivate: [PermissionGuard], data: { name: "size_chart" } },
  { path: 'product-tags', loadChildren: () => import('./product-tags/product-tags.module').then(m => m.ProductTagsModule), canActivate: [PermissionGuard], data: { name: "tags" } },
  { path: 'image-tags', loadChildren: () => import('./image-tags/image-tags.module').then(m => m.ImageTagsModule), canActivate: [PermissionGuard], data: { name: "image_tag" } },
  { path: 'image-gallery', loadChildren: () => import('./image-gallery/image-gallery.module').then(m => m.ImageGalleryModule), canActivate: [PermissionGuard], data: { name: "bulk_upload" } },
  { path: 'product-taxonomy', loadChildren: () => import('./product-taxonomy/product-taxonomy.module').then(m => m.ProductTaxonomyModule), canActivate: [PermissionGuard], data: { name: "product_taxonomy" } },
  { path: 'variant-colors', loadChildren: () => import('./colors/colors.module').then(m => m.ColorsModule), canActivate: [PermissionGuard], data: { name: "variant_colors" } },
  { path: 'amenities', loadChildren: () => import('./amenities/amenities.module').then(m => m.AmenitiesModule), canActivate: [PermissionGuard], data: { name: "amenities" } },
  { path: 'highlights', loadChildren: () => import('./highlights/highlights.module').then(m => m.HighlightsModule), canActivate: [PermissionGuard], data: { name: "highlights" } },
  { path: 'addon-products', loadChildren: () => import('./addon-products/addon-products.module').then(m => m.AddonProductsModule), canActivate: [PermissionGuard], data: { name: "addon_products" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductExtrasRoutingModule { }