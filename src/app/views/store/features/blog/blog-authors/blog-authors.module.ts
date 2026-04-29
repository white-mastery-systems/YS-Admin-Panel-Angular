import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { BlogAuthorsRoutingModule } from './blog-authors-routing.module';
import { BlogAuthorsComponent } from './blog-authors.component';

@NgModule({
  declarations: [BlogAuthorsComponent],
  imports: [
    SharedModule,
    BlogAuthorsRoutingModule
  ]
})

export class BlogAuthorsModule { }
