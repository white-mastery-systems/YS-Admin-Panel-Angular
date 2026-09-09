import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: '', component: SettingComponent },
  { path: 'store', loadChildren: () => import('./store-setting/store-setting.module').then(m => m.StoreSettingModule), canActivate: [PermissionGuard], data: { name: "store_setting" } },
  { path: 'store-config', loadChildren: () => import('./store-config/store-config.module').then(m => m.StoreConfigModule), canActivate: [PermissionGuard], data: { name: "store_setting" } },
  
  { path: 'shipping-methods', loadChildren: () => import('../shipping/shipping-methods/shipping-methods.module').then(m => m.ShippingMethodsModule), canActivate: [PermissionGuard], data: { name: "shipping_methods" } },
  { path: 'delivery-methods', loadChildren: () => import('../shipping/delivery-methods/delivery-methods.module').then(m => m.DeliveryMethodsModule), canActivate: [PermissionGuard], data: { name: "delivery_methods" } },
  { path: 'tax-rates', loadChildren: () => import('../product-extras/tax-rates/tax-rates.module').then(m => m.TaxRatesModule), canActivate: [PermissionGuard], data: { name: "tax_rates" } },

  { path: 'currency-types', loadChildren: () => import('../setup/currency-types/currency-types.module').then(m => m.CurrencyTypesModule), canActivate: [PermissionGuard], data: { name: "currency_types" } },
  { path: 'payment-gateway', loadChildren: () => import('../setup/payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule), canActivate: [PermissionGuard], data: { name: "payment_gateway" } },

  { path: 'feedback', loadChildren: () => import('../properties/feedback/feedback.module').then(m => m.FeedbackModule), canActivate: [PermissionGuard], data: { name: "feedback" } },
  { path: 'newsletter', loadChildren: () => import('../properties/newsletter/newsletter.module').then(m => m.NewsletterModule), canActivate: [PermissionGuard], data: { name: "newsletter" } },  

  { path: 'blogs', loadChildren: () => import('../features/blog/blog.module').then(m => m.BlogModule), canActivate: [PermissionGuard], data: { name: "blogs" } },
  { path: 'blogs-authors', loadChildren: () => import('../features/blog/blog-authors/blog-authors.module').then(m => m.BlogAuthorsModule), canActivate: [PermissionGuard], data: { name: "blog_authors" } },
  { path: 'advanced-blogs', loadChildren: () => import('../features/blog/blog.module').then(m => m.BlogModule), canActivate: [PermissionGuard], data: { name: "advanced_blogs" } },
  { path: 'recipes', loadChildren: () => import('../features/recipe/recipe.module').then(m => m.RecipeModule), canActivate: [PermissionGuard], data: { name: "recipes" } },
  { path: 'articles', loadChildren: () => import('../features/articles/articles.module').then(m => m.ArticlesModule), canActivate: [PermissionGuard], data: { name: "articles" } },
  { path: 'collections', loadChildren: () => import('../features/collections/collections.module').then(m => m.CollectionsModule), canActivate: [PermissionGuard], data: { name: "collections" } },
  { path: 'coupon-codes', loadChildren: () => import('../features/coupon-codes/coupon-codes.module').then(m => m.CouponCodesModule), canActivate: [PermissionGuard], data: { name: "offers" } },
  { path: 'catalog-page', loadChildren: () => import('../features/discounts-page/discounts-page.module').then(m => m.DiscountsPageModule), canActivate: [PermissionGuard], data: { name: "catalog_page" } },
  { path: 'giftcard', loadChildren: () => import('../features/giftcard/giftcard.module').then(m => m.GiftcardModule), canActivate: [PermissionGuard], data: { name: "giftcard" } },
  { path: 'appointment-categories', loadChildren: () => import('../features/appointment-categories/appointment-categories.module').then(m => m.AppointmentCategoriesModule), canActivate: [PermissionGuard], data: { name: "appointment_services" } },

  { path: 'shop-assistant', loadChildren: () => import('../product-extras/shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule), canActivate: [PermissionGuard], data: { name: "shopping_assistant" } },
  { path: 'sizing-assistant', loadChildren: () => import('../product-extras/sizing-assistant/sizing-assistant.module').then(m => m.SizingAssistantModule), canActivate: [PermissionGuard], data: { name: "sizing_assistant" } },

  { path: 'domain', loadChildren: () => import('../deployment/deploy-domain/deploy-domain.module').then(m => m.DeployDomainModule) },
  { path: 'notification', loadChildren: () => import('./notification-setup/notification-setup.module').then(m => m.NotificationSetupModule) },

  { path: 'customers', loadChildren: () => import('src/app/views/store/customers/customers.module').then(m => m.CustomersModule), canActivate: [PermissionGuard], data: { name: "customers" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SettingRoutingModule { }
