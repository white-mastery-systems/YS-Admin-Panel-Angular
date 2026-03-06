import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { BranchProfileRoutingModule } from './branch-profile-routing.module';
import { BranchProfileComponent } from './branch-profile.component';

@NgModule({
  declarations: [
    BranchProfileComponent
  ],
  imports: [
    SharedModule,
    BranchProfileRoutingModule
  ]
})

export class BranchProfileModule { }