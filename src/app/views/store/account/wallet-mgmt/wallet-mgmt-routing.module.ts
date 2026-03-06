import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletMgmtComponent } from './wallet-mgmt.component';

const routes: Routes = [{ path: "", component: WalletMgmtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WalletMgmtRoutingModule { }