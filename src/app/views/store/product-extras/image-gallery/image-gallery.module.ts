import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ImageGalleryRoutingModule } from './image-gallery-routing.module';
import { ImageGalleryComponent } from './image-gallery.component';

@NgModule({
  declarations: [
    ImageGalleryComponent
  ],
  imports: [
    SharedModule,
    ImageGalleryRoutingModule
  ]
})

export class ImageGalleryModule { }