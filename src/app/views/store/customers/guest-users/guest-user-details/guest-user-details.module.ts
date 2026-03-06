import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { GuestUserDetailsRoutingModule } from './guest-user-details-routing.module';
import { GuestUserDetailsComponent } from './guest-user-details.component';

@NgModule({
  declarations: [
    GuestUserDetailsComponent
  ],
  imports: [
    SharedModule,
    GuestUserDetailsRoutingModule
  ]
})

export class GuestUserDetailsModule { }