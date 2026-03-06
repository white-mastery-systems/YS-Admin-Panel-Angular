import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-image-cropper';
import { QuillModule } from 'ngx-quill';
import { ColorPickerModule } from 'ngx-color-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { ModifyProductRoutingModule } from './modify-product-routing.module';
import { ModifyProductComponent } from './modify-product.component';

@NgModule({
  declarations: [ModifyProductComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    ImageCropperModule,
    AmazingTimePickerModule,
    SharedModule,
    ColorPickerModule,
    ModifyProductRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ModifyProductModule { }