import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdMgmtEventsComponent } from './ad-mgmt-events.component';

const routes: Routes = [{ path: "", component: AdMgmtEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdMgmtEventsRoutingModule { }