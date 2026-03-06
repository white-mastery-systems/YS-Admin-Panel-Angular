import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbandonedOrdersRoutingModule } from './abandoned-orders-routing.module';
import { AbandonedOrdersComponent } from './abandoned-orders.component';


@NgModule({
  declarations: [AbandonedOrdersComponent],
  imports: [
    CommonModule,
    AbandonedOrdersRoutingModule
  ]
})
export class AbandonedOrdersModule { }
