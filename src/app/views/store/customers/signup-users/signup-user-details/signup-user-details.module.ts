import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { SignupUserDetailsRoutingModule } from './signup-user-details-routing.module';
import { SignupUserDetailsComponent } from './signup-user-details.component';

@NgModule({
  declarations: [
    SignupUserDetailsComponent
  ],
  imports: [
    SharedModule,
    SignupUserDetailsRoutingModule
  ]
})

export class SignupUserDetailsModule { }