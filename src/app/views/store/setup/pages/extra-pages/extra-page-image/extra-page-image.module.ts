import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../../../shared/shared.module';
import { environment } from '../../../../../../../environments/environment';

import { ExtraPageImageRoutingModule } from './extra-page-image-routing.module';
import { ExtraPageImageComponent } from './extra-page-image.component';

@NgModule({
  declarations: [
    ExtraPageImageComponent
  ],
  imports: [
    CommonModule,
    ExtraPageImageRoutingModule,
    SharedModule,
    QuillModule.forRoot(environment.quill_config)
  ]
})

export class ExtraPageImageModule { }