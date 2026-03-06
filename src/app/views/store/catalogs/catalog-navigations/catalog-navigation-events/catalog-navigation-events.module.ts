import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { CatalogNavigationEventsRoutingModule } from './catalog-navigation-events-routing.module';
import { CatalogNavigationEventsComponent } from './catalog-navigation-events.component';

@NgModule({
  declarations: [
    CatalogNavigationEventsComponent
  ],
  imports: [
    SharedModule,
    CatalogNavigationEventsRoutingModule
  ]
})

export class CatalogNavigationEventsModule { }