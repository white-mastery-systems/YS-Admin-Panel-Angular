import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { GridCardListRoutingModule } from './grid-card-list-routing.module';
import { GridCardListComponent } from './grid-card-list.component';

@NgModule({
  declarations: [
    GridCardListComponent
  ],
  imports: [
    SharedModule,
    GridCardListRoutingModule
  ]
})

export class GridCardListModule { }