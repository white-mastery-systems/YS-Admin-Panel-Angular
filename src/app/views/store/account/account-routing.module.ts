import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'profile', loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule), canActivate: [PermissionGuard], data: { name: "profile" } },
  { path: 'wallet', loadChildren: () => import('./wallet-mgmt/wallet-mgmt.module').then(m => m.WalletMgmtModule), canActivate: [PermissionGuard], data: { name: "store_wallet" } },
  { path: 'billing', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule), canActivate: [PermissionGuard], data: { name: "billing" } },

  { path: 'branch-profile', loadChildren: () => import('./branch-profile/branch-profile.module').then(m => m.BranchProfileModule), canActivate: [PermissionGuard], data: { name: "branch_profile" } },
  { path: 'vendor-profile', loadChildren: () => import('./vendor-profile/vendor-profile.module').then(m => m.VendorProfileModule), canActivate: [PermissionGuard], data: { name: "vendor_profile" } },
  { path: 'vendor-wallet', loadChildren: () => import('./vendor-wallet-mgmt/vendor-wallet-mgmt.module').then(m => m.VendorWalletMgmtModule), canActivate: [PermissionGuard], data: { name: "vendor_wallet" } },
  { path: 'vendor-billing', loadChildren: () => import('./vendor-billing/vendor-billing.module').then(m => m.VendorBillingModule), canActivate: [PermissionGuard], data: { name: "vendor_billing" } },

  { path: 'users', loadChildren: () => import('./sub-users/sub-users.module').then(m => m.SubUsersModule), canActivate: [PermissionGuard], data: { name: "sub_users" } },
  { path: 'branches', loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule), canActivate: [PermissionGuard], data: { name: "branches" } },
  { path: 'store-branches', loadChildren: () => import('./store-branches/store-branches.module').then(m => m.StoreBranchesModule), canActivate: [PermissionGuard], data: { name: "branches" } },
  
  { path: 'app-store', loadChildren: () => import('./app-store/app-store.module').then(m => m.AppStoreModule), canActivate: [PermissionGuard], data: { name: "app_store" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule { }