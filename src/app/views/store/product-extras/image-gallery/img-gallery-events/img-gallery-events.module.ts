import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ImgGalleryEventsRoutingModule } from './img-gallery-events-routing.module';
import { ImgGalleryEventsComponent } from './img-gallery-events.component';

@NgModule({
  declarations: [
    ImgGalleryEventsComponent
  ],
  imports: [
    SharedModule,
    ImgGalleryEventsRoutingModule
  ]
})

export class ImgGalleryEventsModule { }