import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorWalletMgmtComponent } from './vendor-wallet-mgmt.component';

const routes: Routes = [{ path: "", component: VendorWalletMgmtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorWalletMgmtRoutingModule { }