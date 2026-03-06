import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkUploadRoutingModule } from './bulk-upload-routing.module';
import { BulkUploadComponent } from './bulk-upload.component';

@NgModule({
  declarations: [
    BulkUploadComponent
  ],
  imports: [
    CommonModule,
    BulkUploadRoutingModule
  ]
})

export class BulkUploadModule { }