import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreGuard } from './guards/store.guard';
import { MasterGuard } from './guards/master.guard';
import { PermissionGuard } from './guards/permission.guard';

import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { VendorAuthLayoutComponent } from './shared/components/layouts/vendor-auth-layout/vendor-auth-layout.component';

import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { StoreLayoutComponent } from './shared/components/layouts/store-layout/store-layout.component';

const sessionRoutes: Routes = [
  { path: 'session', loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule) },
  { path: 'control-panel', loadChildren: () => import('./views/admin/control-panel/control-panel.module').then(m => m.ControlPanelModule), canActivate: [MasterGuard] }
];

const vendorSessionRoutes: Routes = [
  { path: '', loadChildren: () => import('./views/vendor-session/vendor-session.module').then(m => m.VendorSessionModule) }
];

const adminRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./views/admin/ys-dashboard/ys-dashboard.module').then(m => m.YsDashboardModule) },
  { path: 'currencies', loadChildren: () => import('./views/admin/ys-currencies/ys-currencies.module').then(m => m.YsCurrenciesModule) },
  { path: 'clients', loadChildren: () => import('./views/admin/ys-clients/ys-clients.module').then(m => m.YsClientsModule) },
  { path: 'dealers', loadChildren: () => import('./views/admin/ys-dealers/ys-dealers.module').then(m => m.YsDealersModule) },
  { path: 'packages', loadChildren: () => import('./views/admin/ys-packages/ys-packages.module').then(m => m.YsPackagesModule) },
  { path: 'features', loadChildren: () => import('./views/admin/ys-features/ys-features.module').then(m => m.YsFeaturesModule) },
  { path: 'payments/:type', loadChildren: () => import('./views/admin/ys-payments/ys-payments.module').then(m => m.YsPaymentsModule) },
  { path: 'promotions', loadChildren: () => import('./views/admin/ys-promotions/ys-promotions.module').then(m => m.YsPromotionsModule) },
  { path: 'subscribers', loadChildren: () => import('./views/admin/ys-subscribers/ys-subscribers.module').then(m => m.YsSubscribersModule) },
  { path: 'themes', loadChildren: () => import('./views/admin/ys-themes/ys-themes.module').then(m => m.YsThemesModule) },
  { path: 'notifications', loadChildren: () => import('./views/admin/ys-notifications/ys-notifications.module').then(m => m.YsNotificationsModule) },
  { path: 'announcements', loadChildren: () => import('./views/admin/ys-announcements/ys-announcements.module').then(m => m.YsAnnouncementsModule) },
  { path: 'feedbacks', loadChildren: () => import('./views/admin/ys-feedbacks/ys-feedbacks.module').then(m => m.YsFeedbacksModule) }
];

const storeRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./views/store/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'enquiries', loadChildren: () => import('./views/store/properties/customer-enquiries/customer-enquiries.module').then(m => m.CustomerEnquiriesModule), canActivate: [PermissionGuard], data: { name: "customer_enquiry" } },
  { path: 'vendor-dashboard', loadChildren: () => import('./views/store/dashboard/vendors-dashboard/vendors-dashboard.module').then(m => m.VendorsDashboardModule) },
  { path: 'branch-dashboard', loadChildren: () => import('./views/store/dashboard/branch-dashboard/branch-dashboard.module').then(m => m.BranchDashboardModule) },
  { path: 'support', loadChildren: () => import('./views/store/help-center/help-center.module').then(m => m.HelpCenterModule) },
  { path: 'product-sections', loadChildren: () => import('./views/store/product-sections/product-sections.module').then(m => m.ProductSectionsModule) },
  
  { path: 'orders', loadChildren: () => import('./views/store/orders/orders.module').then(m => m.OrdersModule) },

  { path: 'features', loadChildren: () => import('./views/store/features/features.module').then(m => m.FeaturesModule) },
  { path: 'product-extras', loadChildren: () => import('./views/store/product-extras/product-extras.module').then(m => m.ProductExtrasModule) },
  { path: 'account', loadChildren: () => import('./views/store/account/account.module').then(m => m.AccountModule) },
  { path: 'vendor-account', loadChildren: () => import('./views/store/account/account.module').then(m => m.AccountModule) },
  { path: 'setup', loadChildren: () => import('./views/store/setup/setup.module').then(m => m.SetupModule) },
  { path: 'vendors', loadChildren: () => import('./views/store/vendors/vendors.module').then(m => m.VendorsModule) },

  { path: 'donations', loadChildren: () => import('./views/store/donations/donations.module').then(m => m.DonationsModule), canActivate: [PermissionGuard], data: { name: "donations" } },

  { path: 'setting', loadChildren: () => import('./views/store/setting/setting.module').then(m => m.SettingModule) },
  { path: 'deployment', loadChildren: () => import('./views/store/deployment/deployment.module').then(m => m.DeploymentModule), canActivate: [PermissionGuard], data: { name: "deployment" } },
  { path: 'enquiry/:type', loadChildren: () => import('./views/store/properties/enquiry/enquiry.module').then(m => m.EnquiryModule) }
];

const routes: Routes = [
  { path: '', redirectTo: 'session/signin', pathMatch: 'full' },
  { path: '404', loadChildren: () => import('./views/others/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: 'welcome/:type', loadChildren: () => import('./views/store/welcome-screen/welcome-screen.module').then(m => m.WelcomeScreenModule) },
  { path: 'payment-summary/:type/:id', loadChildren: () => import('./views/others/payment-summary/payment-summary.module').then(m => m.PaymentSummaryModule) },
  { path: 'payment-summary/:type/:id/:store_id', loadChildren: () => import('./views/others/payment-summary/payment-summary.module').then(m => m.PaymentSummaryModule) },
  { path: 'payment-failure', loadChildren: () => import('./views/others/payment-failure/payment-failure.module').then(m => m.PaymentFailureModule) },
  { path: '', component: AuthLayoutComponent, children: sessionRoutes },
  { path: 'vendor', component: VendorAuthLayoutComponent, children: vendorSessionRoutes },
  { path: 'branch', component: VendorAuthLayoutComponent, children: vendorSessionRoutes },
  { path: 'admin', component: AdminLayoutComponent, children: adminRoutes, canActivate: [MasterGuard] },
  { path: '', component: StoreLayoutComponent, children: storeRoutes, canActivate: [StoreGuard] },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }