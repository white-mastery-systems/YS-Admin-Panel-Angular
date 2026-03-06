import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopAssistantComponent } from './shop-assistant.component';
import { PermissionGuard } from '../../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: ShopAssistantComponent },
  { path: ':type', loadChildren: () => import('../../product-extras/shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule), canActivate: [PermissionGuard], data: { name: "shopping_assistant" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShopAssistantRoutingModule { }