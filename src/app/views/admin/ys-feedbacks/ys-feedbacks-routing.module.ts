import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YsFeedbacksComponent } from './ys-feedbacks.component';

const routes: Routes = [{ path: "", component: YsFeedbacksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsFeedbacksRoutingModule { }