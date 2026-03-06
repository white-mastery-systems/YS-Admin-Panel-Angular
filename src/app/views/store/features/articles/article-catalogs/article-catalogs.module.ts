import { NgModule } from '@angular/core';

import { ArticleCatalogsRoutingModule } from './article-catalogs-routing.module';
import { ArticleCatalogsComponent } from './article-catalogs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    ArticleCatalogsComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    ArticleCatalogsRoutingModule
  ]
})
export class ArticleCatalogsModule { }
