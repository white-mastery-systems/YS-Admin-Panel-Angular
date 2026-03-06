import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettlementsRoutingModule } from './settlements-routing.module';
import { SettlementsComponent } from './settlements.component';


@NgModule({
  declarations: [
    SettlementsComponent
  ],
  imports: [
    CommonModule,
    SettlementsRoutingModule
  ]
})
export class SettlementsModule { }
