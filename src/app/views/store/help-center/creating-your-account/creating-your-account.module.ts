import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatingYourAccountRoutingModule } from './creating-your-account-routing.module';
import { CreatingYourAccountComponent } from './creating-your-account.component';


@NgModule({
  declarations: [CreatingYourAccountComponent],
  imports: [
    CommonModule,
    CreatingYourAccountRoutingModule
  ]
})
export class CreatingYourAccountModule { }
