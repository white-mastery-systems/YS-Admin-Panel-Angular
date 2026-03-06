import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YsAnnouncementsComponent } from './ys-announcements.component';

const routes: Routes = [{ path: "", component: YsAnnouncementsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsAnnouncementsRoutingModule { }