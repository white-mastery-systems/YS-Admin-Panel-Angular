import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { TagInputModule } from 'ngx-chips';

import { ExtraPagesRoutingModule } from './extra-pages-routing.module';
import { ExtraPagesComponent } from './extra-pages.component';

@NgModule({
  declarations: [ExtraPagesComponent],
  imports: [
    SharedModule,
    ExtraPagesRoutingModule,
    TagInputModule
  ]
})

export class ExtraPagesModule { }