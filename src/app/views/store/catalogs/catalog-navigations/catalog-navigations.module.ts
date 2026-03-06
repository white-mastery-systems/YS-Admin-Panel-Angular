import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogNavigationsRoutingModule } from './catalog-navigations-routing.module';
import { CatalogNavigationsComponent } from './catalog-navigations.component';

@NgModule({
  declarations: [
    CatalogNavigationsComponent
  ],
  imports: [
    SharedModule,
    CatalogNavigationsRoutingModule
  ]
})

export class CatalogNavigationsModule { }