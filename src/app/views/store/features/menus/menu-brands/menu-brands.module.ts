import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { MenuBrandsRoutingModule } from './menu-brands-routing.module';
import { MenuBrandsComponent } from './menu-brands.component';

@NgModule({
  declarations: [
    MenuBrandsComponent
  ],
  imports: [
    SharedModule,
    MenuBrandsRoutingModule
  ]
})

export class MenuBrandsModule { }