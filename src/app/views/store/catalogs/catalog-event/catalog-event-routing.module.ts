import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogEventComponent } from './catalog-event.component';

const routes: Routes = [{ path: "", component: CatalogEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogEventRoutingModule { }