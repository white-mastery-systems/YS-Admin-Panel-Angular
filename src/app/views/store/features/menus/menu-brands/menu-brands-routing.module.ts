import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuBrandsComponent } from './menu-brands.component';

const routes: Routes = [{ path: "", component: MenuBrandsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuBrandsRoutingModule { }