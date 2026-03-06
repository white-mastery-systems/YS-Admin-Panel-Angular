import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportProductComponent } from './import-product.component';

const routes: Routes = [{ path: "", component: ImportProductComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ImportProductRoutingModule { }