import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteProductRoutingModule } from './delete-product-routing.module';
import { DeleteProductComponent } from './delete-product.component';


@NgModule({
  declarations: [DeleteProductComponent],
  imports: [
    CommonModule,
    DeleteProductRoutingModule
  ]
})
export class DeleteProductModule { }
