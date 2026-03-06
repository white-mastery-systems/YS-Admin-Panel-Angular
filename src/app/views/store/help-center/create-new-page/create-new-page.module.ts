import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateNewPageRoutingModule } from './create-new-page-routing.module';
import { CreateNewPageComponent } from './create-new-page.component';


@NgModule({
  declarations: [CreateNewPageComponent],
  imports: [
    CommonModule,
    CreateNewPageRoutingModule
  ]
})
export class CreateNewPageModule { }
