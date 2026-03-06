import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchKeywordsComponent } from './search-keywords.component';

const routes: Routes = [{ path: "", component: SearchKeywordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchKeywordsRoutingModule { }