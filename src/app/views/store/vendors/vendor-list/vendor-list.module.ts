import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorListRoutingModule } from './vendor-list-routing.module';
import { VendorListComponent } from './vendor-list.component';

@NgModule({
  declarations: [
    VendorListComponent
  ],
  imports: [
    SharedModule,
    TagInputModule,
    VendorListRoutingModule
  ]
})

export class VendorListModule { }