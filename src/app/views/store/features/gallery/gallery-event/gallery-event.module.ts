import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';

import { GalleryEventRoutingModule } from './gallery-event-routing.module';
import { GalleryEventComponent } from './gallery-event.component';


@NgModule({
  declarations: [
    GalleryEventComponent
  ],
  imports: [
    CommonModule,
    GalleryEventRoutingModule,
    SharedModule
  ]
})
export class GalleryEventModule { }
