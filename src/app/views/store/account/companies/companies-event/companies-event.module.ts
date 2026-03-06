import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { CompaniesEventRoutingModule } from './companies-event-routing.module';
import { CompaniesEventComponent } from './companies-event.component';


@NgModule({
  declarations: [
    CompaniesEventComponent
  ],
  imports: [
    SharedModule,
    CompaniesEventRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CompaniesEventModule { }
