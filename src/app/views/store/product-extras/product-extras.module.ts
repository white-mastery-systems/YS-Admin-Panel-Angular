import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ProductExtrasRoutingModule } from './product-extras-routing.module';
import { ProductExtrasComponent } from './product-extras.component';

@NgModule({
  declarations: [ProductExtrasComponent],
  imports: [
    SharedModule,
    ProductExtrasRoutingModule
  ]
})

export class ProductExtrasModule { }