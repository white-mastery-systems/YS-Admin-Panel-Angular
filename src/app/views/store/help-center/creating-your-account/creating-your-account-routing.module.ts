import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatingYourAccountComponent } from './creating-your-account.component';

const routes: Routes = [
  { path:'', component: CreatingYourAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreatingYourAccountRoutingModule { }