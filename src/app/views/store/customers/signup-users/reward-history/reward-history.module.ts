import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { RewardHistoryRoutingModule } from './reward-history-routing.module';
import { RewardHistoryComponent } from './reward-history.component';

@NgModule({
  declarations: [
    RewardHistoryComponent
  ],
  imports: [
    SharedModule,
    RewardHistoryRoutingModule
  ]
})

export class RewardHistoryModule { }