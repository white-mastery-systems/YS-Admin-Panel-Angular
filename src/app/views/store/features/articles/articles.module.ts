import { NgModule } from '@angular/core';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [
    TagInputModule,
    SharedModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
