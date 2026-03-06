import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { VendorProfileRoutingModule } from './vendor-profile-routing.module';
import { VendorProfileComponent } from './vendor-profile.component';

@NgModule({
  declarations: [VendorProfileComponent],
  imports: [
    SharedModule,
    TagInputModule,
    VendorProfileRoutingModule
  ]
})

export class VendorProfileModule { }