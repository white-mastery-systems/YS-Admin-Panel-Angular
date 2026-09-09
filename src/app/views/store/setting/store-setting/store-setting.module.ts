import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreSettingRoutingModule } from './store-setting-routing.module';
import { StoreSettingComponent } from './store-setting.component';

@NgModule({
  declarations: [StoreSettingComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    TagInputModule,
    ColorPickerModule,
    BsDatepickerModule,
    StoreSettingRoutingModule
  ]
})

export class StoreSettingModule { }