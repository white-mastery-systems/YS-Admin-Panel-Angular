import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ImportHistoryRoutingModule } from './import-history-routing.module';
import { ImportHistoryComponent } from './import-history.component';

@NgModule({
  declarations: [
    ImportHistoryComponent
  ],
  imports: [
    SharedModule,
    ImportHistoryRoutingModule
  ]
})

export class ImportHistoryModule { }