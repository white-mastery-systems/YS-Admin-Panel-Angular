import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterLinksComponent } from './footer-links.component';

const routes: Routes = [
  {path:'', component:FooterLinksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooterLinksRoutingModule { }
