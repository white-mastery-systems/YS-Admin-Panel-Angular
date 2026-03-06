import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { AdDetailsRoutingModule } from './ad-details-routing.module';
import { AdDetailsComponent } from './ad-details.component';

@NgModule({
  declarations: [AdDetailsComponent],
  imports: [
    SharedModule,
    AdDetailsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class AdDetailsModule { }