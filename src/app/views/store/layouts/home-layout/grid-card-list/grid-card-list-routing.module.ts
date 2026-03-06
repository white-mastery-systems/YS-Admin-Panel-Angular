import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridCardListComponent } from './grid-card-list.component';

const routes: Routes = [{ path: "", component: GridCardListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GridCardListRoutingModule { }