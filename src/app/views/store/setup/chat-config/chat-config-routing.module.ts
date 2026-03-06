import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatConfigComponent } from './chat-config.component';

const routes: Routes = [{ path: "", component: ChatConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ChatConfigRoutingModule { }