import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './articles.component';

const routes: Routes = [
  { path: '', component: ArticlesComponent },
  { path: 'catalogs', loadChildren: () => import('./article-catalogs/article-catalogs.module').then(m => m.ArticleCatalogsModule) },
  { path: ':id', loadChildren: () => import('./article-event/article-event.module').then(m => m.ArticleEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
