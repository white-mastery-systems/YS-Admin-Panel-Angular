import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { FooterSeoLinksRoutingModule } from './footer-seo-links-routing.module';
import { FooterSeoLinksComponent } from './footer-seo-links.component';

@NgModule({
  declarations: [
    FooterSeoLinksComponent
  ],
  imports: [
    SharedModule,
    FooterSeoLinksRoutingModule
  ]
})

export class FooterSeoLinksModule { }