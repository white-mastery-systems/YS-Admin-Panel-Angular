import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementBarComponent } from './announcement-bar.component';

const routes: Routes = [{ path: "", component: AnnouncementBarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AnnouncementBarRoutingModule { }