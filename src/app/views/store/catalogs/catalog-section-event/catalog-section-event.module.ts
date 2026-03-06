import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogSectionEventRoutingModule } from './catalog-section-event-routing.module';
import { CatalogSectionEventComponent } from './catalog-section-event.component';

@NgModule({
  declarations: [
    CatalogSectionEventComponent
  ],
  imports: [
    SharedModule,
    CatalogSectionEventRoutingModule
  ]
})

export class CatalogSectionEventModule { }