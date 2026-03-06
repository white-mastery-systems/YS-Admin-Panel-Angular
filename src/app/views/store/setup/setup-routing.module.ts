import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: "", component: SetupComponent },
  { path: 'layouts', loadChildren: () => import('../layouts/layouts.module').then(m => m.LayoutsModule) },
  { path: 'announcement-bar', loadChildren: () => import('./announcement-bar/announcement-bar.module').then(m => m.AnnouncementBarModule), canActivate: [PermissionGuard], data: { name: "announce_bar" } },
  { path: 'chat-configuration', loadChildren: () => import('./chat-config/chat-config.module').then(m => m.ChatConfigModule), canActivate: [PermissionGuard], data: { name: "chat_config" } },
  { path: 'store-popup', loadChildren: () => import('./store-popup/store-popup.module').then(m => m.StorePopupModule), canActivate: [PermissionGuard], data: { name: "store_popup" } },
  { path: 'search-keywords', loadChildren: () => import('./search-keywords/search-keywords.module').then(m => m.SearchKeywordsModule), canActivate: [PermissionGuard], data: { name: "search_keywords" } },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [PermissionGuard], data: { name: "pages" } },
  { path: 'policies', loadChildren: () => import('./policies/policies.module').then(m => m.PoliciesModule), canActivate: [PermissionGuard], data: { name: "policies" } },
  { path: 'seo/store', loadChildren: () => import('./store-seo/store-seo.module').then(m => m.StoreSeoModule), canActivate: [PermissionGuard], data: { name: "store_seo" } },
  { path: 'footer-content', loadChildren: () => import('./footer-content/footer-content.module').then(m => m.FooterContentModule), canActivate: [PermissionGuard], data: { name: "footer_content" } },
  { path: 'footer-seo-links', loadChildren: () => import('./footer-seo-links/footer-seo-links.module').then(m => m.FooterSeoLinksModule), canActivate: [PermissionGuard], data: { name: "footer_seo_links" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SetupRoutingModule { }