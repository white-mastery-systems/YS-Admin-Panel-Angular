import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    SharedModule,
    SettingRoutingModule
  ]
})

export class SettingModule { }