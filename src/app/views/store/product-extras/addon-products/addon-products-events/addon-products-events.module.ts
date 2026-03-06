import { NgModule } from '@angular/core';
import { AddonProductsEventsRoutingModule } from './addon-products-events-routing.module';
import { AddonProductsEventsComponent } from './addon-products-events.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AddonProductsEventsComponent
  ],
  imports: [
    SharedModule,
    AddonProductsEventsRoutingModule
  ]
})

export class AddonProductsEventsModule { }