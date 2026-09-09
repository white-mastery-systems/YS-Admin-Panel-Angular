import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';
import { environment } from '../../../../../../environments/environment';

import { RecipeEventRoutingModule } from './recipe-event-routing.module';
import { RecipeEventComponent } from './recipe-event.component';

@NgModule({
  declarations: [
    RecipeEventComponent
  ],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    SharedModule,
    BsDatepickerModule,
    RecipeEventRoutingModule
  ]
})

export class RecipeEventModule { }