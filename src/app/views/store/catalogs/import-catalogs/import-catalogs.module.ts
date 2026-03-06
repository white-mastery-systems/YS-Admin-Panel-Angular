import { NgModule } from '@angular/core';
import { ImportCatalogsRoutingModule } from './import-catalogs-routing.module';
import { ImportCatalogsComponent } from './import-catalogs.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ImportCatalogsComponent
  ],
  imports: [
    SharedModule,
    ImportCatalogsRoutingModule
  ]
})

export class ImportCatalogsModule { }