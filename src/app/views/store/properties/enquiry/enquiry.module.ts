import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { EnquiryRoutingModule } from './enquiry-routing.module';
import { EnquiryComponent } from './enquiry.component';

@NgModule({
  declarations: [EnquiryComponent],
  imports: [
    SharedModule,
    EnquiryRoutingModule
  ]
})

export class EnquiryModule { }