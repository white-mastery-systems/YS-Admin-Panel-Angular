import { NgModule } from '@angular/core';

import { WebStoriesRoutingModule } from './web-stories-routing.module';
import { WebStoriesComponent } from './web-stories.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WebStoriesComponent
  ],
  imports: [
    SharedModule,
    WebStoriesRoutingModule
  ]
})
export class WebStoriesModule { }
