import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogPagesEventComponent } from './catalog-pages-event.component';

const routes: Routes = [
  { path: '', component: CatalogPagesEventComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogPagesEventRoutingModule { }
