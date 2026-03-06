import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoCodesRoutingModule } from './promo-codes-routing.module';
import { PromoCodesComponent } from './promo-codes.component';


@NgModule({
  declarations: [PromoCodesComponent],
  imports: [
    CommonModule,
    PromoCodesRoutingModule
  ]
})
export class PromoCodesModule { }
