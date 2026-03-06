import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { CourierPartnersRoutingModule } from './courier-partners-routing.module';
import { CourierPartnersComponent } from './courier-partners.component';

@NgModule({
  declarations: [CourierPartnersComponent],
  imports: [
    SharedModule,
    CourierPartnersRoutingModule
  ]
})

export class CourierPartnersModule { }