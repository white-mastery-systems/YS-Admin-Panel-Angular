import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadWebsiteLogoComponent } from './upload-website-logo.component';
const routes: Routes = [
  {path:'', component:UploadWebsiteLogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadWebsiteLogoRoutingModule { }
