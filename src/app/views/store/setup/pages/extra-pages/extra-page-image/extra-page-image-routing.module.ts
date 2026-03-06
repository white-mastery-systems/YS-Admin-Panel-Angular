import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraPageImageComponent } from './extra-page-image.component';

const routes: Routes = [
  {path: '',component: ExtraPageImageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExtraPageImageRoutingModule { }