import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreConfigRoutingModule } from './store-config-routing.module';
import { StoreConfigComponent } from './store-config.component';

@NgModule({
  declarations: [
    StoreConfigComponent
  ],
  imports: [
    SharedModule,
    StoreConfigRoutingModule
  ]
})

export class StoreConfigModule { }