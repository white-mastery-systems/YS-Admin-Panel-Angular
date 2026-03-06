import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { FooterSeoLinkEventsRoutingModule } from './footer-seo-link-events-routing.module';
import { FooterSeoLinkEventsComponent } from './footer-seo-link-events.component';

@NgModule({
  declarations: [
    FooterSeoLinkEventsComponent
  ],
  imports: [
    SharedModule,
    FooterSeoLinkEventsRoutingModule
  ]
})

export class FooterSeoLinkEventsModule { }