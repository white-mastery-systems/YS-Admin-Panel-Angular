import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveOrdersRoutingModule } from './live-orders-routing.module';
import { LiveOrdersComponent } from './live-orders.component';


@NgModule({
  declarations: [LiveOrdersComponent],
  imports: [
    CommonModule,
    LiveOrdersRoutingModule
  ]
})
export class LiveOrdersModule { }
