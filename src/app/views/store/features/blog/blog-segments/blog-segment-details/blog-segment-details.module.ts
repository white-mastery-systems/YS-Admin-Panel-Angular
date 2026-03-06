import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../../../shared/shared.module';
import { environment } from '../../../../../../../environments/environment';

import { BlogSegmentDetailsRoutingModule } from './blog-segment-details-routing.module';
import { BlogSegmentDetailsComponent } from './blog-segment-details.component';

@NgModule({
  declarations: [
    BlogSegmentDetailsComponent
  ],
  imports: [
    SharedModule,
    QuillModule.forRoot(environment.quill_config),
    BlogSegmentDetailsRoutingModule
  ]
})

export class BlogSegmentDetailsModule { }