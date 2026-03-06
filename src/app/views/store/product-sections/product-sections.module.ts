import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ProductSectionsRoutingModule } from './product-sections-routing.module';
import { ProductSectionsComponent } from './product-sections.component';

@NgModule({
  declarations: [ProductSectionsComponent],
  imports: [
    SharedModule,
    ProductSectionsRoutingModule
  ]
})

export class ProductSectionsModule { }