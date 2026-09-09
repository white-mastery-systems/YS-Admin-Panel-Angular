import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AdOrdersRoutingModule } from './ad-orders-routing.module';
import { AdOrdersComponent } from './ad-orders.component';

@NgModule({
  declarations: [AdOrdersComponent],
  imports: [
    SharedModule,
    AdOrdersRoutingModule,
    BsDatepickerModule
  ]
})

export class AdOrdersModule { }