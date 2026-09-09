import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogAuthorsComponent } from './blog-authors.component';

const routes: Routes = [
  { path: '', component: BlogAuthorsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogAuthorsRoutingModule { }
