import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';


@NgModule({
  declarations: [
    CompaniesComponent
  ],
  imports: [
    SharedModule,
    CompaniesRoutingModule
  ]
})
export class CompaniesModule { }
