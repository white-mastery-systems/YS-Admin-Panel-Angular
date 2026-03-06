import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupShippingRoutingModule } from './setup-shipping-routing.module';
import { SetupShippingComponent } from './setup-shipping.component';


@NgModule({
  declarations: [SetupShippingComponent],
  imports: [
    CommonModule,
    SetupShippingRoutingModule
  ]
})
export class SetupShippingModule { }
