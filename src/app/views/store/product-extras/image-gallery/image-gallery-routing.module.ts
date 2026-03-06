import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageGalleryComponent } from './image-gallery.component';

const routes: Routes = [
  { path: "", component: ImageGalleryComponent },
  { path: ":id", loadChildren: () => import('./img-gallery-events/img-gallery-events.module').then(m => m.ImgGalleryEventsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ImageGalleryRoutingModule { }