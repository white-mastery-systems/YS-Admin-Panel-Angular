import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery.component';

const routes: Routes = [ 
  { path: '', component: GalleryComponent },
  { path:':id',loadChildren: () => import('./gallery-event/gallery-event.module').then(m => m.GalleryEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GalleryRoutingModule { }