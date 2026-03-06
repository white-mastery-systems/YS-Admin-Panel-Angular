import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { SignupUsersRoutingModule } from './signup-users-routing.module';
import { SignupUsersComponent } from './signup-users.component';

@NgModule({
  declarations: [SignupUsersComponent],
  imports: [
    SharedModule,
    SignupUsersRoutingModule
  ]
})

export class SignupUsersModule { }