import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreBranchesRoutingModule } from './store-branches-routing.module';
import { StoreBranchesComponent } from './store-branches.component';

@NgModule({
  declarations: [
    StoreBranchesComponent
  ],
  imports: [
    SharedModule,
    StoreBranchesRoutingModule
  ]
})

export class StoreBranchesModule { }