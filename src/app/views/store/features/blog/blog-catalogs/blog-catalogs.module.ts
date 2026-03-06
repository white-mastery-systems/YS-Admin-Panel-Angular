import { NgModule } from '@angular/core';

import { BlogCatalogsRoutingModule } from './blog-catalogs-routing.module';
import { BlogCatalogsComponent } from './blog-catalogs.component';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

@NgModule({
  declarations: [
    BlogCatalogsComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    BlogCatalogsRoutingModule
  ]
})

export class BlogCatalogsModule { }