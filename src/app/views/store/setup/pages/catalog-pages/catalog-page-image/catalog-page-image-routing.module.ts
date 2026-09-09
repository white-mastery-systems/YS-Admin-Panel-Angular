import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogPageImageComponent } from './catalog-page-image.component';

const routes: Routes = [
  { path: '', component: CatalogPageImageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogPageImageRoutingModule { }
