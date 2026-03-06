import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../../../shared/shared.module';
import { environment } from '../../../../../../../environments/environment';

import { ExtraPagesEventRoutingModule } from './extra-pages-event-routing.module';
import { ExtraPagesEventComponent } from './extra-pages-event.component';

@NgModule({
  declarations: [ExtraPagesEventComponent],
  imports: [
    SharedModule,
    TagInputModule,
    QuillModule.forRoot(environment.quill_config),
    ExtraPagesEventRoutingModule
  ]
})

export class ExtraPagesEventModule { }