import { NgModule } from '@angular/core';

import { ArticleEventRoutingModule } from './article-event-routing.module';
import { ArticleEventComponent } from './article-event.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    ArticleEventComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    ArticleEventRoutingModule
  ]
})
export class ArticleEventModule { }
