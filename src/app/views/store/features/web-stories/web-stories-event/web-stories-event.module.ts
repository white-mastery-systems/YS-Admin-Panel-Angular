import { NgModule } from '@angular/core';

import { WebStoriesEventRoutingModule } from './web-stories-event-routing.module';
import { WebStoriesEventComponent } from './web-stories-event.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    WebStoriesEventComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    WebStoriesEventRoutingModule
  ]
})
export class WebStoriesEventModule { }
