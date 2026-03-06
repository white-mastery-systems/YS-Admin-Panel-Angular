import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleCatalogsComponent } from './article-catalogs.component';

const routes: Routes = [{path:'', component:ArticleCatalogsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleCatalogsRoutingModule { }
