import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [AccountRoutingModule, SharedModule]
})

export class AccountModule { }