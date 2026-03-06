import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from './recipe.component';

const routes: Routes = [
  { path: "", component: RecipeComponent },
  { path: ':id', loadChildren: () => import('./recipe-event/recipe-event.module').then(m => m.RecipeEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RecipeRoutingModule { }