import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyYsThemesComponent } from './modify-ys-themes.component';

const routes: Routes = [{ path: "", component: ModifyYsThemesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModifyYsThemesRoutingModule { }