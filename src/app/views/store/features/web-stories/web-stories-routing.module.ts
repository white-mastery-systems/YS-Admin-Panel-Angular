import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebStoriesComponent } from './web-stories.component';

const routes: Routes = [
  {path:'', component: WebStoriesComponent},
  { path: ':id', loadChildren: () => import('./web-stories-event/web-stories-event.module').then(m => m.WebStoriesEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebStoriesRoutingModule { }
