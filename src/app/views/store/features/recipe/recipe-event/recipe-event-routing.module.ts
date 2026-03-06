import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeEventComponent } from './recipe-event.component';

const routes: Routes = [{ path: "", component: RecipeEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RecipeEventRoutingModule { }