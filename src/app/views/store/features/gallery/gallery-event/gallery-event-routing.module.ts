import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryEventComponent } from './gallery-event.component';

const routes: Routes = [{ path: '', component: GalleryEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryEventRoutingModule { }
