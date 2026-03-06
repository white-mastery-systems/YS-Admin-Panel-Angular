import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickOrdersRoutingModule } from './quick-orders-routing.module';
import { QuickOrdersComponent } from './quick-orders.component';


@NgModule({
  declarations: [QuickOrdersComponent],
  imports: [
    CommonModule,
    QuickOrdersRoutingModule
  ]
})
export class QuickOrdersModule { }
