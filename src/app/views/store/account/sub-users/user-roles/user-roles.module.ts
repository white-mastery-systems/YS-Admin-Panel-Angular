import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRolesComponent } from './user-roles.component';

@NgModule({
  declarations: [
    UserRolesComponent
  ],
  imports: [
    SharedModule,
    UserRolesRoutingModule
  ]
})

export class UserRolesModule { }