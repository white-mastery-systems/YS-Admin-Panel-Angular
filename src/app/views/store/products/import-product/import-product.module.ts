import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ImportProductRoutingModule } from './import-product-routing.module';
import { ImportProductComponent } from './import-product.component';

@NgModule({
  declarations: [
    ImportProductComponent
  ],
  imports: [
    SharedModule,
    ImportProductRoutingModule
  ]
})

export class ImportProductModule { }