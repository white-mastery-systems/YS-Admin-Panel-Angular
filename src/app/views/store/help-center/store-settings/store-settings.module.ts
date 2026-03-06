import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreSettingsRoutingModule } from './store-settings-routing.module';
import { StoreSettingsComponent } from './store-settings.component';


@NgModule({
  declarations: [
    StoreSettingsComponent
  ],
  imports: [
    CommonModule,
    StoreSettingsRoutingModule
  ]
})
export class StoreSettingsModule { }
