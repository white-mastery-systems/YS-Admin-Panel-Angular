import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ImageTagsRoutingModule } from './image-tags-routing.module';
import { ImageTagsComponent } from './image-tags.component';

@NgModule({
  declarations: [ImageTagsComponent],
  imports: [
    SharedModule,
    ImageTagsRoutingModule
  ]
})

export class ImageTagsModule { }