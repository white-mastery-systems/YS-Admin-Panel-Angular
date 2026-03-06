import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';


import { CatalogEventRoutingModule } from './catalog-event-routing.module';
import { CatalogEventComponent } from './catalog-event.component';

@NgModule({
  declarations: [CatalogEventComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    CatalogEventRoutingModule
  ]
})

export class CatalogEventModule { }