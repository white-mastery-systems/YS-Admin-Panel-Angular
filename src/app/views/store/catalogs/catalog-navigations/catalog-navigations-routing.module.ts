import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogNavigationsComponent } from './catalog-navigations.component';

const routes: Routes = [{ path: "", component: CatalogNavigationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogNavigationsRoutingModule { }