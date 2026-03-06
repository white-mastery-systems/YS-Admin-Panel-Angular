import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateNewPageComponent } from './create-new-page.component';

const routes: Routes = [
  {path:'', component:CreateNewPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateNewPageRoutingModule { }
