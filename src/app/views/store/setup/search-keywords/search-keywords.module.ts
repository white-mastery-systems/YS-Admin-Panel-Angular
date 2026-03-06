import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { SearchKeywordsRoutingModule } from './search-keywords-routing.module';
import { SearchKeywordsComponent } from './search-keywords.component';

@NgModule({
  declarations: [SearchKeywordsComponent],
  imports: [
    SharedModule,
    TagInputModule,
    SearchKeywordsRoutingModule
  ]
})

export class SearchKeywordsModule { }