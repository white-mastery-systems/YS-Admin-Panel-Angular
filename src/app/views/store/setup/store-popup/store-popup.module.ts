import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { StorePopupRoutingModule } from './store-popup-routing.module';
import { StorePopupComponent } from './store-popup.component';

@NgModule({
  declarations: [StorePopupComponent],
  imports: [
    SharedModule,
    StorePopupRoutingModule
  ]
})

export class StorePopupModule { }