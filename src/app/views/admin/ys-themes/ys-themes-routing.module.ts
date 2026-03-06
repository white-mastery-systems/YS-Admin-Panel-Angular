import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YsThemesComponent } from './ys-themes.component';

const routes: Routes = [
  { path: "", component: YsThemesComponent },
  { path: 'add/:rank', loadChildren: () => import('./modify-ys-themes/modify-ys-themes.module').then(m => m.ModifyYsThemesModule) },
  { path: 'modify/:id/:rank', loadChildren: () => import('./modify-ys-themes/modify-ys-themes.module').then(m => m.ModifyYsThemesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsThemesRoutingModule { }