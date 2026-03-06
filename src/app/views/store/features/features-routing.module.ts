import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'menus', loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule), canActivate: [PermissionGuard], data: { name: "menus" } },
  { path: 'site-gallery', loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule), canActivate: [PermissionGuard], data: { name: "site_gallery" } },
  { path: 'dinamic-offers', loadChildren: () => import('./dinamic-offers/dinamic-offers.module').then(m => m.DinamicOffersModule), canActivate: [PermissionGuard], data: { name: "dinamic_offers" } },
  { path: 'ad-management', loadChildren: () => import('./ad-management/ad-management.module').then(m => m.AdManagementModule), canActivate: [PermissionGuard], data: { name: "ad_management" } },
  { path: 'web-stories', loadChildren: () => import('./web-stories/web-stories.module').then(m => m.WebStoriesModule), canActivate: [PermissionGuard], data: { name: "web_stories" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }