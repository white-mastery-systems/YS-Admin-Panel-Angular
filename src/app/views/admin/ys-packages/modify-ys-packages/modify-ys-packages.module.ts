import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ModifyYsPackagesRoutingModule } from './modify-ys-packages-routing.module';
import { ModifyYsPackagesComponent } from './modify-ys-packages.component';

@NgModule({
  declarations: [
    ModifyYsPackagesComponent
  ],
  imports: [
    SharedModule,
    ModifyYsPackagesRoutingModule
  ]
})

export class ModifyYsPackagesModule { }