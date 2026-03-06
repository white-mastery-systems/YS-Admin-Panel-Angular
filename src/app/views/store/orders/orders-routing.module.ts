import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: OrdersComponent },
  { path: 'create-order', loadChildren: () => import('./product/create-product-order/create-product-order.module').then(m => m.CreateProductOrderModule), canActivate: [PermissionGuard], data: { name: "manual_order" } },

  { path: 'quotations/:type/:customer_id', loadChildren: () => import('../quotations/quotations.module').then(m => m.QuotationsModule), canActivate: [PermissionGuard], data: { name: "quotations" } },
  
  { path: 'product/inactive/:customer_id', loadChildren: () => import('./product/inactive-product-orders/inactive-product-orders.module').then(m => m.InactiveProductOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_orders" } },
  { path: 'product/:type/:customer_id', loadChildren: () => import('./product/product-orders/product-orders.module').then(m => m.ProductOrdersModule), canActivate: [PermissionGuard], data: { name: "orders" } },
  { path: 'product/:type/:customer_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "orders" } },

  { path: 'gift-coupon', loadChildren: () => import('./giftcard/giftcard-orders/giftcard-orders.module').then(m => m.GiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },
  { path: 'inactive-gift-coupons', loadChildren: () => import('./giftcard/inactive-giftcard-orders/inactive-giftcard-orders.module').then(m => m.InactiveGiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_gift_orders" } },
  { path: 'gift-coupon/:coupon_id', loadChildren: () => import('./giftcard/giftcard-order-details/giftcard-order-details.module').then(m => m.GiftcardOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },

  { path: 'gift-coupon/:coupon_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },

  { path: 'dinamic-offers', loadChildren: () => import('./dinamic/dinamic-orders/dinamic-orders.module').then(m => m.DinamicOrdersModule), canActivate: [PermissionGuard], data: { name: "dinamic_offer_orders" } },
  { path: 'inactive-dinamic-offers', loadChildren: () => import('./dinamic/inactive-dinamic-orders/inactive-dinamic-orders.module').then(m => m.InactiveDinamicOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_dinamic_offer_orders" } },
  { path: 'dinamic-offers/:order_id', loadChildren: () => import('./dinamic/dinamic-order-details/dinamic-order-details.module').then(m => m.DinamicOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "dinamic_offer_orders" } },

  { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule), canActivate: [PermissionGuard], data: { name: "appointments" } },

  { path: 'quick-orders', loadChildren: () => import('./quick-orders/quick-orders.module').then(m => m.QuickOrdersModule), canActivate: [PermissionGuard], data: { name: "quick_order" } },

  { path: 'abandoned-cart', loadChildren: () => import('src/app/views/store/abandoned/abandoned.module').then(m => m.AbandonedModule), canActivate: [PermissionGuard], data: { name: "abandoned_cart" } },
  { path: 'abandoned-quote', loadChildren: () => import('src/app/views/store/abandoned/abandoned.module').then(m => m.AbandonedModule), canActivate: [PermissionGuard], data: { name: "abandoned_quotes" } }
];

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: OrdersComponent, children: routes }])],
  exports: [RouterModule]
})

export class OrdersRoutingModule { }