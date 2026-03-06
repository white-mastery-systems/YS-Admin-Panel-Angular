import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImgGalleryEventsComponent } from './img-gallery-events.component';

const routes: Routes = [{ path: "", component: ImgGalleryEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ImgGalleryEventsRoutingModule { }