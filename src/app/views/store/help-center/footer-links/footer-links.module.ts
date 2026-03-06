import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterLinksRoutingModule } from './footer-links-routing.module';
import { FooterLinksComponent } from './footer-links.component';


@NgModule({
  declarations: [FooterLinksComponent],
  imports: [
    CommonModule,
    FooterLinksRoutingModule
  ]
})
export class FooterLinksModule { }
