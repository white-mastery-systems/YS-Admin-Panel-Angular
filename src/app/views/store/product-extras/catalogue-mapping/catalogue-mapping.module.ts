import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CatalogueMappingRoutingModule } from './catalogue-mapping-routing.module';
import { CatalogueMappingComponent } from './catalogue-mapping.component';

@NgModule({
  declarations: [CatalogueMappingComponent],
  imports: [
    SharedModule,
    CatalogueMappingRoutingModule
  ]
})

export class CatalogueMappingModule { }
