import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ]
})

export class OrdersModule { }