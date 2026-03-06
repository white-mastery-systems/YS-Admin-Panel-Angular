import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogCatalogsComponent } from './blog-catalogs.component';

const routes: Routes = [
  { path: '', component: BlogCatalogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogCatalogsRoutingModule { }