import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogSectionEventComponent } from './catalog-section-event.component';

const routes: Routes = [{ path: "", component: CatalogSectionEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogSectionEventRoutingModule { }