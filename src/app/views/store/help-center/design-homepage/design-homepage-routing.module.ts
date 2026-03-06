import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignHomepageComponent } from './design-homepage.component';

const routes: Routes = [
  {path:'', component:DesignHomepageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignHomepageRoutingModule { }
