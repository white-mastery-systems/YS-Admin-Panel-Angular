import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { TagInputModule } from 'ngx-chips';

import { CatalogPagesRoutingModule } from './catalog-pages-routing.module';
import { CatalogPagesComponent } from './catalog-pages.component';

@NgModule({
  declarations: [CatalogPagesComponent],
  imports: [
    SharedModule,
    CatalogPagesRoutingModule,
    TagInputModule
  ]
})

export class CatalogPagesModule { }
