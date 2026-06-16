import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueMappingComponent } from './catalogue-mapping.component';

const routes: Routes = [{ path: '', component: CatalogueMappingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogueMappingRoutingModule { }
