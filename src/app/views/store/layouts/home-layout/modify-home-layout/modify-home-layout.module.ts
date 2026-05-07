import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

import { ModifyHomeLayoutRoutingModule } from './modify-home-layout-routing.module';
import { ModifyHomeLayoutComponent } from './modify-home-layout.component';

@NgModule({
  declarations: [ModifyHomeLayoutComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    ModifyHomeLayoutRoutingModule
  ]
})

export class ModifyHomeLayoutModule { }
