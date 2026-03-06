import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogNavigationEventsComponent } from './catalog-navigation-events.component';

const routes: Routes = [{ path: "", component: CatalogNavigationEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogNavigationEventsRoutingModule { }