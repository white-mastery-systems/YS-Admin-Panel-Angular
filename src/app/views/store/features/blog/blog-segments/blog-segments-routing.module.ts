import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogSegmentsComponent } from './blog-segments.component';

const routes: Routes = [
  { path: "", component: BlogSegmentsComponent },
  { path: ':seg_id', loadChildren: () => import('./blog-segment-details/blog-segment-details.module').then(m => m.BlogSegmentDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogSegmentsRoutingModule { }