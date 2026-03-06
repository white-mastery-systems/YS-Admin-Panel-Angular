import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PermissionGuard } from '../../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: PagesComponent },
  { path: 'contact-page', loadChildren: () => import('./contact-page/contact-page.module').then(m => m.ContactPageModule), canActivate: [PermissionGuard], data: { name: "contact_page" } },
  { path: 'store-locator', loadChildren: () => import('./store-locator/store-locator.module').then(m => m.StoreLocatorModule), canActivate: [PermissionGuard], data: { name: "store_locator" } },
  { path: 'extra-pages', loadChildren: () => import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule), canActivate: [PermissionGuard], data: { name: "extra_pages" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }