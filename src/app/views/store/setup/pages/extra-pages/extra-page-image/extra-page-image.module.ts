import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../../shared/shared.module';

import { ExtraPageImageRoutingModule } from './extra-page-image-routing.module';
import { ExtraPageImageComponent } from './extra-page-image.component';

@NgModule({
  declarations: [
    ExtraPageImageComponent
  ],
  imports: [
    CommonModule,
    ExtraPageImageRoutingModule,
    SharedModule
  ]
})

export class ExtraPageImageModule { }