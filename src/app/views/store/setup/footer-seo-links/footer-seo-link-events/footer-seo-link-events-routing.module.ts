import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterSeoLinkEventsComponent } from './footer-seo-link-events.component';

const routes: Routes = [{ path: "", component: FooterSeoLinkEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FooterSeoLinkEventsRoutingModule { }