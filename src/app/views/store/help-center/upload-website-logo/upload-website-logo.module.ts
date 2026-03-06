import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadWebsiteLogoRoutingModule } from './upload-website-logo-routing.module';
import { UploadWebsiteLogoComponent } from './upload-website-logo.component';


@NgModule({
  declarations: [UploadWebsiteLogoComponent],
  imports: [
    CommonModule,
    UploadWebsiteLogoRoutingModule
  ]
})
export class UploadWebsiteLogoModule { }
