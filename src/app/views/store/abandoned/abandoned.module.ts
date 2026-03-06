import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { AbandonedRoutingModule } from './abandoned-routing.module';
import { AbandonedComponent } from './abandoned.component';

@NgModule({
  declarations: [AbandonedComponent],
  imports: [
    SharedModule,
    AbandonedRoutingModule
  ]
})

export class AbandonedModule { }