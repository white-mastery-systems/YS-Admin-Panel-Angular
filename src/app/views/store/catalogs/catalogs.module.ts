import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs.component';

@NgModule({
  declarations: [CatalogsComponent],
  imports: [
    SharedModule,
    CatalogsRoutingModule
  ]
})

export class CatalogsModule { }