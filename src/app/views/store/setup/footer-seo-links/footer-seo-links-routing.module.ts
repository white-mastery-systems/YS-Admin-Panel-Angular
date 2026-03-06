import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterSeoLinksComponent } from './footer-seo-links.component';

const routes: Routes = [
  { path: "", component: FooterSeoLinksComponent },
  { path: 'add/:rank', loadChildren: () => import('./footer-seo-link-events/footer-seo-link-events.module').then(m => m.FooterSeoLinkEventsModule) },
  { path: 'modify/:id/:rank', loadChildren: () => import('./footer-seo-link-events/footer-seo-link-events.module').then(m => m.FooterSeoLinkEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FooterSeoLinksRoutingModule { }