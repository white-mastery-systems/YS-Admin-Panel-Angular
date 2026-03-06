import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';

const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: 'catalogs', loadChildren: () => import('./blog-catalogs/blog-catalogs.module').then(m => m.BlogCatalogsModule) },
  { path: 'segments/:id', loadChildren: () => import('./blog-segments/blog-segments.module').then(m => m.BlogSegmentsModule) },
  { path: ':id', loadChildren: () => import('./blog-event/blog-event.module').then(m => m.BlogEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogRoutingModule { }