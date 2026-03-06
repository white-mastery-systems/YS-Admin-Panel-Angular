import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportCatalogsComponent } from './import-catalogs.component';

const routes: Routes = [{path:'', component: ImportCatalogsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportCatalogsRoutingModule { }