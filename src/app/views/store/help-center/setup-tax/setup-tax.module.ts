import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupTaxRoutingModule } from './setup-tax-routing.module';
import { SetupTaxComponent } from './setup-tax.component';


@NgModule({
  declarations: [SetupTaxComponent],
  imports: [
    CommonModule,
    SetupTaxRoutingModule
  ]
})
export class SetupTaxModule { }
