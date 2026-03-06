import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { ModifyYsThemesRoutingModule } from './modify-ys-themes-routing.module';
import { ModifyYsThemesComponent } from './modify-ys-themes.component';

@NgModule({
  declarations: [
    ModifyYsThemesComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    ModifyYsThemesRoutingModule
  ]
})

export class ModifyYsThemesModule { }