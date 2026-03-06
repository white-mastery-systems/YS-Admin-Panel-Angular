import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { BlogSegmentsRoutingModule } from './blog-segments-routing.module';
import { BlogSegmentsComponent } from './blog-segments.component';

@NgModule({
  declarations: [
    BlogSegmentsComponent
  ],
  imports: [
    SharedModule,
    BlogSegmentsRoutingModule
  ]
})

export class BlogSegmentsModule { }