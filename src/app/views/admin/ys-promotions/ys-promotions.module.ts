import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsPromotionsRoutingModule } from './ys-promotions-routing.module';
import { YsPromotionsComponent } from './ys-promotions.component';

@NgModule({
  declarations: [YsPromotionsComponent],
  imports: [
    SharedModule,
    YsPromotionsRoutingModule
  ]
})

export class YsPromotionsModule { }