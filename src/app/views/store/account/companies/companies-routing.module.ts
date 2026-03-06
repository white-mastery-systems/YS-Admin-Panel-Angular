import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies.component';

const routes: Routes = [
  {path:'', component: CompaniesComponent},
  {path:':id', loadChildren: () => import('./companies-event/companies-event.module').then(m => m.CompaniesEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
