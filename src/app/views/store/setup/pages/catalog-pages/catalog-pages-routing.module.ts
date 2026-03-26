import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogPagesComponent } from './catalog-pages.component';

const routes: Routes = [
  { path: '', component: CatalogPagesComponent },
  { path: 'add', loadChildren: () => import('./catalog-pages-event/catalog-pages-event.module').then(m => m.CatalogPagesEventModule) },
  { path: 'modify/:id', loadChildren: () => import('./catalog-pages-event/catalog-pages-event.module').then(m => m.CatalogPagesEventModule) },
  { path: 'modify/:id/:seg_id', loadChildren: () => import('./catalog-page-image/catalog-page-image.module').then(m => m.CatalogPageImageModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogPagesRoutingModule { }
