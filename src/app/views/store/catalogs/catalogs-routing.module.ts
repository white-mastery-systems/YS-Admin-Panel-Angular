import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogsComponent } from './catalogs.component';

const routes: Routes = [
  { path: '', component: CatalogsComponent }, 
  { path: 'import', loadChildren: () => import('./import-catalogs/import-catalogs.module').then(m => m.ImportCatalogsModule) },
  { path: 'section/:id', loadChildren: () => import('./catalog-section-event/catalog-section-event.module').then(m => m.CatalogSectionEventModule) },
  { path: 'navigation/:id', loadChildren: () => import('./catalog-navigations/catalog-navigations.module').then(m => m.CatalogNavigationsModule) },
  { path: 'navigation/:sectionId/:id', loadChildren: () => import('./catalog-navigations/catalog-navigation-events/catalog-navigation-events.module').then(m => m.CatalogNavigationEventsModule) },
  { path: ':id', loadChildren: () => import('./catalog-event/catalog-event.module').then(m => m.CatalogEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogsRoutingModule { }