import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpCenterComponent } from './help-center.component';

const childRoutes: Routes = [
  { path: 'creating-your-account', loadChildren: () => import('../help-center/creating-your-account/creating-your-account.module').then(m => m.CreatingYourAccountModule) },
  { path: 'domain', loadChildren: () => import('../help-center/domain/domain.module').then(m => m.DomainModule) },
  { path: 'design-website/design-homepage', loadChildren: () => import('../help-center/design-homepage/design-homepage.module').then(m => m.DesignHomepageModule) },
  { path: 'design-website/create-new-page', loadChildren: () => import('../help-center/create-new-page/create-new-page.module').then(m => m.CreateNewPageModule) },
  { path: 'design-website/upload-website-logo', loadChildren: () => import('../help-center/upload-website-logo/upload-website-logo.module').then(m => m.UploadWebsiteLogoModule) },
  { path: 'navigation/product-categories', loadChildren: () => import('../help-center/product-catalog/product-catalog.module').then(m => m.ProductCatalogModule) },
  { path: 'navigation/header-menu', loadChildren: () => import('../help-center/header-menu/header-menu.module').then(m => m.HeaderMenuModule) },
  { path: 'navigation/footer-links', loadChildren: () => import('../help-center/footer-links/footer-links.module').then(m => m.FooterLinksModule) },
  { path: 'products', loadChildren: () => import('../help-center/product-management/product-management.module').then(m => m.ProductManagementModule) },
  { path: 'promo-codes', loadChildren: () => import('../help-center/promo-codes/promo-codes.module').then(m => m.PromoCodesModule) },
  { path: 'live-orders', loadChildren: () => import('../help-center/live-orders/live-orders.module').then(m => m.LiveOrdersModule) },
  { path: 'abandoned-orders', loadChildren: () => import('../help-center/abandoned-orders/abandoned-orders.module').then(m => m.AbandonedOrdersModule) },
  { path: 'quick-orders', loadChildren: () => import('../help-center/quick-orders/quick-orders.module').then(m => m.QuickOrdersModule) },
  { path: 'failed-payments', loadChildren: () => import('../help-center/failed-payments/failed-payments.module').then(m => m.FailedPaymentsModule) },
  { path: 'customers', loadChildren: () => import('../help-center/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'setup-shipping', loadChildren: () => import('../help-center/setup-shipping/setup-shipping.module').then(m => m.SetupShippingModule) },
  { path: 'setup-payment', loadChildren: () => import('../help-center/setup-payment/setup-payment.module').then(m => m.SetupPaymentModule) },
  { path: 'setup-tax', loadChildren: () => import('../help-center/setup-tax/setup-tax.module').then(m => m.SetupTaxModule) },
  { path: 'edit-products', loadChildren: () => import('../help-center/edit-product/edit-product.module').then(m => m.EditProductModule) },
  { path: 'delete-products', loadChildren: () => import('../help-center/delete-product/delete-product.module').then(m => m.DeleteProductModule) },
  { path: 'store-settings', loadChildren: () => import('../help-center/store-settings/store-settings.module').then(m => m.StoreSettingsModule) },
  { path: 'dashboard', loadChildren: () => import('../help-center/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'settlements', loadChildren: () => import('../help-center/settlements/settlements.module').then(m => m.SettlementsModule) },
  { path: 'profile', loadChildren: () => import('../help-center/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'bulk-upload', loadChildren: () => import('./bulk-upload/bulk-upload.module').then(m => m.BulkUploadModule) }
];

const routes: Routes = [
  { path: '', component: HelpCenterComponent, children: childRoutes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HelpCenterRoutingModule { }