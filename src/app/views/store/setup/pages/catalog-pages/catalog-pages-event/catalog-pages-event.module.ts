import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../../../shared/shared.module';
import { environment } from '../../../../../../../environments/environment';

import { CatalogPagesEventRoutingModule } from './catalog-pages-event-routing.module';
import { CatalogPagesEventComponent } from './catalog-pages-event.component';

@NgModule({
  declarations: [CatalogPagesEventComponent],
  imports: [
    SharedModule,
    TagInputModule,
    QuillModule.forRoot(environment.quill_config),
    CatalogPagesEventRoutingModule
  ]
})

export class CatalogPagesEventModule { }
