import { NgModule } from '@angular/core';
import { AddonProductsRoutingModule } from './addon-products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddonProductsComponent } from './addon-products.component';

@NgModule({
  declarations: [AddonProductsComponent],
  imports: [
    SharedModule,
    AddonProductsRoutingModule
  ]
})

export class AddonProductsModule { }