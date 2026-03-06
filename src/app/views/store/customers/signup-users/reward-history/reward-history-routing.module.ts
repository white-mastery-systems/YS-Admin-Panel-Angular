import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardHistoryComponent } from './reward-history.component';

const routes: Routes = [{ path: "", component: RewardHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RewardHistoryRoutingModule { }