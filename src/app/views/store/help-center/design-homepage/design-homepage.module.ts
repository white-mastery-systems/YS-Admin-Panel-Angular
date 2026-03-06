import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignHomepageRoutingModule } from './design-homepage-routing.module';
import { DesignHomepageComponent } from './design-homepage.component';


@NgModule({
  declarations: [DesignHomepageComponent],
  imports: [
    CommonModule,
    DesignHomepageRoutingModule
  ]
})
export class DesignHomepageModule { }
