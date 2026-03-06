import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ChatConfigRoutingModule } from './chat-config-routing.module';
import { ChatConfigComponent } from './chat-config.component';

@NgModule({
  declarations: [ChatConfigComponent],
  imports: [
    SharedModule,
    ChatConfigRoutingModule
  ]
})

export class ChatConfigModule { }