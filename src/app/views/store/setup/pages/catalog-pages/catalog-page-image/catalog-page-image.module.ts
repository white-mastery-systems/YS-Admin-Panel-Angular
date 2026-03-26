import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';

import { CatalogPageImageRoutingModule } from './catalog-page-image-routing.module';
import { CatalogPageImageComponent } from './catalog-page-image.component';

@NgModule({
  declarations: [CatalogPageImageComponent],
  imports: [
    SharedModule,
    CatalogPageImageRoutingModule
  ]
})

export class CatalogPageImageModule { }
