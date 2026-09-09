import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { NewsletterComponent } from './newsletter.component';

@NgModule({
  declarations: [NewsletterComponent],
  imports: [
    SharedModule,
    BsDatepickerModule,
    NewsletterRoutingModule
  ]
})

export class NewsletterModule { }