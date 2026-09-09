import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

import { BlogEventRoutingModule } from './blog-event-routing.module';
import { BlogEventComponent } from './blog-event.component';

@NgModule({
  declarations: [BlogEventComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    BsDatepickerModule,
    BlogEventRoutingModule
  ]
})

export class BlogEventModule { }