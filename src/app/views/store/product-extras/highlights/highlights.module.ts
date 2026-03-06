import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { HighlightsRoutingModule } from './highlights-routing.module';
import { HighlightsComponent } from './highlights.component';

@NgModule({
  declarations: [
    HighlightsComponent
  ],
  imports: [
    SharedModule,
    HighlightsRoutingModule
  ]
})

export class HighlightsModule { }