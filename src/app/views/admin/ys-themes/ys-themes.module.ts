import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsThemesRoutingModule } from './ys-themes-routing.module';
import { YsThemesComponent } from './ys-themes.component';

@NgModule({
  declarations: [
    YsThemesComponent
  ],
  imports: [
    SharedModule,
    YsThemesRoutingModule
  ]
})

export class YsThemesModule { }