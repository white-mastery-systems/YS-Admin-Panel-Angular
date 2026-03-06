import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleEventComponent } from './article-event.component';

const routes: Routes = [{path:'', component: ArticleEventComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleEventRoutingModule { }
