import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraPagesComponent } from './extra-pages.component';

const routes: Routes = [
  { path: "", component: ExtraPagesComponent },
  { path: "add", loadChildren: () => import('./extra-pages-event/extra-pages-event.module').then(m => m.ExtraPagesEventModule) },
  { path: "modify/:id", loadChildren: () => import('./extra-pages-event/extra-pages-event.module').then(m => m.ExtraPagesEventModule) },
  { path: "modify/:id/:seg_id", loadChildren: () => import('./extra-page-image/extra-page-image.module').then(m => m.ExtraPageImageModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExtraPagesRoutingModule { }