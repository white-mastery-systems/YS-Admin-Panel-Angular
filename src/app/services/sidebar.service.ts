import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreApiService } from '../services/store-api.service';
import { CommonService } from '../services/common.service';
import { SocketService } from '../services/socket.service';
import { environment } from 'src/environments/environment';

export interface IMenuItem {
	id?: string;
	title?: string;
	type: string;       // Possible values: link/dropDown/extLink
	name?: string;      // Used as display text for item and title for separator type
	state?: string;     // Router state
	icon?: string;      // Material icon name
	tooltip?: string;   // Tooltip text
	disabled?: boolean; // If true, item will not be appeared in sidenav.
	sub?: IChildItem[]; // Dropdown items
	badges?: IBadge[];
	active?: boolean;
  expand?: boolean;
  hidden_routes?: any[];
}

export interface IChildItem {
	id?: string;
	parentId?: string;
	type?: string;
	name: string;       // Display text
	state?: string;     // Router state
	icon?: string;
	sub?: IChildItem[];
	active?: boolean;
}

interface IBadge {
	color: string;      // primary/accent/warn/hex color codes(#fff000)
	value: string;      // Display text
}

interface ISidebarState {
	sidenavOpen?: boolean;
	childnavOpen?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class SidebarService {

	public sidebarState: ISidebarState = {
		sidenavOpen: true,
		childnavOpen: false
  };
  sidePanelList: IMenuItem[] = [];

	constructor(private storeApi: StoreApiService, private commonService: CommonService, private router: Router, private io: SocketService) { }

	BUILD_CATEGORY_LIST() {
    this.storeApi.CATALOG_LIST().subscribe(result => {
      this.commonService.catalog_list = [];
      if(result.status) { this.commonService.catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1)); }
      this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
    });
  }
  
  getSidePanelList() {
    this.sidePanelList = [];
    let routePermissionList = []; let userPermList = [];
    const tulsiAiStoreId = environment.config_data.tulsi_ai_catalog_store_id;
    const isTulsiAiStore = String(this.commonService.store_details?._id || '') === String(tulsiAiStoreId);
    // whats new
    let ysFeatures = this.commonService.ys_features;
    let subuserFeatures = this.commonService.subuser_features;
    // admin
    if(this.commonService.store_details.login_type=='admin') {
      if(this.commonService.store_details.status=='active') {
        this.commonService.subuser_features = ["add_product", "update_product"];
        if(this.commonService.store_details._id != environment.config_data.chettinad_id) {
          this.commonService.subuser_features.push("delete_product");
        }
        routePermissionList.push("dashboard", "profile");
        if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
        if(ysFeatures.indexOf('reward_points')!=-1) routePermissionList.push("reward_history");
        // dashboard
        this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'assets/icons/sidebar/dashboard.svg', state: '/dashboard' });
        userPermList.push({ title: "DASHBOARD", sub_list: [{ keyword: "dashboard", name: "Analytics" }] });
        // products
        this.sidePanelList.push({ name: 'Products', type: 'link', icon: 'assets/icons/sidebar/products.svg', state: '/product-sections', hidden_routes: ['/product-extras'] });
        this.commonService.product_menu_list = [
          { name: 'Products', state: '/product-sections/products' },
          { name: 'Catalogs', state: '/product-sections/catalogs' }
        ];
        routePermissionList.push("catalogs", "products", "product_add", "product_edit");
        let tempExtraList = [
          { keyword: "catalogs", name: "Catalog Management" },
          { keyword: "products", name: "All Products" },
          { keyword: "add_product", name: "Add Product" },
          { keyword: "update_product", name: "Update Product" },
          { keyword: "delete_product", name: "Delete Product" }
        ];
        // product extras
        this.commonService.product_extras_list = [];
        if(ysFeatures.indexOf('addon_products')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Addon Products', state: '/product-extras/addon-products', type: 'link', icon:'shopping_basket' });
          routePermissionList.push("addon_products");
          tempExtraList.push({ keyword: "addon_products", name: "Addon Products" });
        }
        else {
          if(ysFeatures.indexOf('measurements')!=-1) {
            this.commonService.product_extras_list.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link', icon:'straighten' });
            routePermissionList.push("measurements");
            tempExtraList.push({ keyword: "measurements", name: "Measurement Sets" });
          }
          if(ysFeatures.indexOf('addons')!=-1) {
            this.commonService.product_extras_list.push({ name: 'Addons', state: '/product-extras/addons', type: 'link', icon:'shopping_basket' });
            routePermissionList.push("addons");
            tempExtraList.push({ keyword: "addons", name: "Addons" });
          }
        }
        if(ysFeatures.indexOf('product_filters')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Product Tags', state: '/product-extras/product-tags', type: 'link', icon:'label' });
          if (isTulsiAiStore) {
            this.commonService.product_extras_list.push({ name: 'AI Catalogue Mapping', state: '/product-extras/catalogue-mapping', type: 'link', icon:'auto_awesome' });
          }
          routePermissionList.push("tags");
          tempExtraList.push({ keyword: "tags", name: "Product Tags" });
          if (isTulsiAiStore) {
            tempExtraList.push({ keyword: "tags", name: "AI Catalogue Mapping" });
          }
        }
        if(ysFeatures.indexOf('foot_note')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link', icon:'description' });
          routePermissionList.push("foot_note");
          tempExtraList.push({ keyword: "foot_note", name: "Foot Note" });
        }
        if(ysFeatures.indexOf('size_chart')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link', icon:'insert_chart' });
          routePermissionList.push("size_chart");
          tempExtraList.push({ keyword: "size_chart", name: "Size Chart" });
        }
        if(ysFeatures.indexOf('faq')!=-1) {
          this.commonService.product_extras_list.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link', icon:'quiz' });
          routePermissionList.push("faq");
          tempExtraList.push({ keyword: "faq", name: "FAQ" });
        }
        if(ysFeatures.indexOf('image_label')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Image Tags', state: '/product-extras/image-tags', type: 'link', icon:'photo_album' });
          routePermissionList.push("image_tag");
          tempExtraList.push({ keyword: "image_tag", name: "Image Tags" });
        }
        if(ysFeatures.indexOf('variant_colors')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Variant Colors', state: '/product-extras/variant-colors', type: 'link', icon:'palette' });
          routePermissionList.push("variant_colors");
          tempExtraList.push({ keyword: "variant_colors", name: "Variant Colors" });
        }
        if(ysFeatures.indexOf('highlights')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Highlights', state: '/product-extras/highlights', type: 'link', icon:'stack_star' });
          routePermissionList.push("highlights");
          tempExtraList.push({ keyword: "highlights", name: "Highlights" });
        }
        if(ysFeatures.indexOf('amenities')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Amenities', state: '/product-extras/amenities', type: 'link', icon:'image_search' });
          routePermissionList.push("amenities");
          tempExtraList.push({ keyword: "amenities", name: "Amenities" });
        }
        if(this.commonService.store_details.type!='estates') {
          this.commonService.product_extras_list.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link', icon:'group_work' });
          routePermissionList.push("product_taxonomy");
          tempExtraList.push({ keyword: "product_taxonomy", name: "Product Taxonomy" });
        }
        if(this.commonService.store_details?.package_details?.package_id!=environment.config_data.free_package_id) {
          this.commonService.product_extras_list.push({ name: 'Image Uploader', state: '/product-extras/image-gallery', type: 'link', icon:'photo_library' });
          routePermissionList.push("bulk_upload");
          tempExtraList.push({ keyword: "bulk_upload", name: "Image Uploader" });
        }
        if(this.commonService.product_extras_list.length) {
          this.commonService.product_menu_list.push({ name: 'Product Extras', state: '/product-sections/extras' });
        }
        if(ysFeatures.indexOf('product_archive')!=-1) {
          routePermissionList.push("product_archive");
          this.commonService.product_menu_list.push({ name: 'Archived Products', state: '/product-sections/archive' });
          tempExtraList.push({ keyword: "product_archive", name: "Archived Products" });
        }
        if(this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id || ysFeatures.indexOf('product_reviews')!=-1) {
          routePermissionList.push("product_reviews");
          this.commonService.product_menu_list.push({ name: 'Product Reviews', state: '/product-sections/reviews' });
          tempExtraList.push({ keyword: "product_reviews", name: "Product Reviews" });
        }
        userPermList.push({ title: "PRODUCTS", sub_list: tempExtraList });
        // enquiries
        this.sidePanelList.push({ name: 'Enquiries', type: 'link', icon: 'assets/icons/sidebar/enquiry.svg', state: '/enquiries' });
        routePermissionList.push("customer_enquiry");
        userPermList.push({ title: "ENQUIRIES", sub_list: [{ keyword: "customer_enquiry", name: "Customer Enquiries" }] });
        let quotList: IChildItem[] = [];
        let orderList: IChildItem[] = []; 
        let tempOrderList = [];
        // quotations
        if(this.commonService.store_details.type=='quot_based' && this.commonService.store_details.sub_type=='quot') {
          quotList.push({ icon: 'slow_motion_video', name: 'Live Requests', state: '/orders/quotations/live/all', type: 'link' });
          routePermissionList.push("quotations");
          tempOrderList.push({ keyword: "quotations", name: "Quotes" });
          // abandoned
          if(ysFeatures.indexOf('abandoned_cart')!=-1) {
            quotList.push({ name: 'Abandoned Quote', type: 'dropDown', icon: 'remove_shopping_cart', state: '/orders/abandoned-quote', sub: [
              { name: 'Signed Up Users', state: '/orders/abandoned-quote/customer', type: 'link' },
              { name: 'Guest Users', state: '/orders/abandoned-quote/guest-user', type: 'link' }
            ] });
            routePermissionList.push("abandoned_quotes");
            tempOrderList.push({ keyword: "abandoned_quotes", name: "Abandoned Quote" });
          }
          // completed & cancelled orders
          quotList.push(
            { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/orders/quotations/confirmed/all', type: 'link' },
            { icon: 'highlight_off', name: 'Cancelled Requests', state: '/orders/quotations/cancelled/all', type: 'link' }
          );
          this.sidePanelList.push({ name: 'Quotes', type: 'dropDown', icon: 'assets/icons/sidebar/quoatiations.svg', sub: quotList });
        }
        // live orders
        if(this.commonService.store_details.type!='estates')
        {
          if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type!='enquiry')
          {
            orderList.push({ icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' });
            routePermissionList.push("orders");
            tempOrderList.push({ keyword: "live_orders", name: "Live Orders" });
            tempOrderList.push({ keyword: "completed_orders", name: "Completed Orders" });
            tempOrderList.push({ keyword: "cancelled_orders", name: "Cancelled Orders" });
            if(ysFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
            if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type=='order')
            {
              // abandoned
              if(ysFeatures.indexOf('abandoned_cart')!=-1) {
                orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', state: '/orders/abandoned-cart', sub: [
                  { name: 'Signed Up Users', state: '/orders/abandoned-cart/customer', type: 'link' },
                  { name: 'Guest Users', state: '/orders/abandoned-cart/guest-user', type: 'link' }
                ] });
                routePermissionList.push("abandoned_cart");
                tempOrderList.push({ keyword: "abandoned_cart", name: "Abandoned Cart" });
              }
              // inactive orders
              orderList.push({ icon: 'error_outline', name: 'Failed Payments', state: '/orders/product/inactive/all', type: 'link' });
              routePermissionList.push("inactive_orders");
              tempOrderList.push({ keyword: "inactive_orders", name: "Failed Payments" });
              // quick order
              if(ysFeatures.indexOf('quick_order')!=-1) {
                orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/orders/quick-orders', type: 'link' });
                routePermissionList.push("quick_order");
                tempOrderList.push({ keyword: "quick_order", name: "Quick Orders" });
              }
            }
            // gift card
            if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
              orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
              routePermissionList.push("giftcard_orders");
              tempOrderList.push({ keyword: "giftcard_orders", name: "Gift Card Orders" });
            }
            // appointments
            if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
              orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
              routePermissionList.push("appointments");
              tempOrderList.push({ keyword: "appointments", name: "Appointments" });
            }
            // completed & cancelled orders
            orderList.push(
              { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
              { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
            );
            this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'assets/icons/sidebar/orders.svg', sub: orderList });
            userPermList.push({ title: "ORDERS", sub_list: tempOrderList });
          }
        }
        quotList.forEach(el => {
          this.commonService.order_menu_list.push(el);
        });
        orderList.forEach(el => {
          this.commonService.order_menu_list.push(el);
        });
        // marketing tools
        let toolList: IChildItem[] = []; let tempToolList = [];
        if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type=='order') {
          if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
            toolList.push({ icon: 'local_offer', name: 'Offers', state: '/setting/coupon-codes', type: 'link' });
            routePermissionList.push("offers");
            tempToolList.push({ keyword: "offers", name: "Offers" });
          }
        }
        if(ysFeatures.indexOf('giftcard')!=-1) {
          toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/setting/giftcard', type: 'link' });
          routePermissionList.push("giftcard");
          tempToolList.push({ keyword: "giftcard", name: "Gift Cards" });
        }
        if(ysFeatures.indexOf('newsletter')!=-1) {
          toolList.push({ icon: 'mail', name: 'Newsletter', state: '/setting/newsletter', type: 'link' });
          routePermissionList.push("newsletter");
          tempToolList.push({ keyword: "newsletter", name: "Newsletter" });
        }
        if(ysFeatures.indexOf('customer_feedback')!=-1) {
          toolList.push({ icon: 'feedback', name: 'Feedback', state: '/setting/feedback', type: 'link' });
          routePermissionList.push("feedback");
          tempToolList.push({ keyword: "feedback", name: "Feedback" });
        }
        // customer
        toolList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', state: '/setting/customers', sub: [
          { name: 'Signed Up Users', state: '/setting/customers/signup-user', type: 'link' },
          { name: 'Guest Users', state: '/setting/customers/guest-users', type: 'link' }
        ] });
        routePermissionList.push("customers");
        tempToolList.push({ keyword: "customers", name: "Customers" });
        this.sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'assets/icons/sidebar/marketing-new.svg', sub: toolList });
        if(tempToolList.length) userPermList.push({ title: "MARKETING TOOLS", sub_list: tempToolList });
        // website
        let webList: IChildItem[] = [
          { icon: 'format_paint', name: 'Home Page', state: '/setup/layouts/home', type: 'link' }
        ];
        routePermissionList.push("home_layout");
        let tempWebList = [{ keyword: "home_layout", name: "Home Page" }];
        if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
          webList.push({ icon: 'menu_book', name: 'Header Navigation', state: '/features/menus', type: 'link' });
          routePermissionList.push("menus");
          tempWebList.push({ keyword: "menu", name: "Header Navigation" });
        }
        webList.push({ name: 'Announcement Bar', type: 'link', icon: 'menu_book', state: '/setup/announcement-bar' });
        routePermissionList.push("announce_bar");
        tempWebList.push({ keyword: "announce_bar", name: "Announcement Bar" });
        if(ysFeatures.indexOf('whatsapp_chat')!=-1 || ysFeatures.indexOf('messenger')!=-1) {
          webList.push({ name: 'Chat Configuration', type: 'link', icon: 'menu_book', state: '/setup/chat-configuration' });
          routePermissionList.push("chat_config");
          tempWebList.push({ keyword: "chat_config", name: "Chat Configuration" });
        }
        if(ysFeatures.indexOf('newsletter')!=-1) {
          webList.push({ name: 'Newsletter & Popup', type: 'link', icon: 'menu_book', state: '/setup/store-popup' });
          routePermissionList.push("store_popup");
          tempWebList.push({ keyword: "store_popup", name: "Newsletter & Popup" });
        }
        if(ysFeatures.indexOf('product_search')!=-1) {
          webList.push({ name: 'Search Keywords', type: 'link', icon: 'menu_book', state: '/setup/search-keywords' });
          routePermissionList.push("search_keywords");
          tempWebList.push({ keyword: "search_keywords", name: "Search Keywords" });
        }
        webList.push(
          { name: 'Policies', type: 'link', icon: 'policy', state: '/setup/policies' },
          { name: 'Store SEO', type: 'link', icon: 'track_changes', state: '/setup/seo/store' },
          { icon: 'contact_phone', name: 'Pages', state: '/setup/pages', type: 'link' },
          { icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' }
        );
        routePermissionList.push("policies", "store_seo", "pages", "contact_page", "footer_content");
        tempWebList.push(
          { keyword: "policies", name: "Policies" },
          { keyword: "store_seo", name: "Store SEO" },
          { keyword: "pages", name: "Pages" },
          { keyword: "contact_page", name: "Contact Page" }
        );
        if(ysFeatures.indexOf('store_locator')!=-1) {
          routePermissionList.push("store_locator");
          tempWebList.push({ keyword: "store_locator", name: "Store Locator" });
        }
        if(ysFeatures.indexOf('extra_pages')!=-1) {
          routePermissionList.push("extra_pages");
          tempWebList.push({ keyword: "extra_pages", name: "Extra Pages" });
        }
        if(environment.config_data.catalog_pages.indexOf(this.commonService.store_details._id)!=-1) {
          routePermissionList.push("catalog_page");
          tempWebList.push({ keyword: "catalog_page", name: "Catalog Pages" });
        }
        tempWebList.push({ keyword: "footer_configuration", name: "Footer Configuration" });
        if(ysFeatures.indexOf('catalog_page_content')!=-1) {
          webList.push({ name: 'Footer SEO Links', type: 'link', icon: 'track_changes', state: '/setup/footer-seo-links' });
          routePermissionList.push("footer_seo_links");
          tempWebList.push({ keyword: "footer_seo_links", name: "Footer SEO Links" });
        }
        if(environment.config_data.gallery.indexOf(this.commonService.store_details._id)!=-1) {
          webList.push({ name: 'Site Gallery', type: 'link', icon: 'track_changes', state: '/features/site-gallery' });
          routePermissionList.push("site_gallery");
          tempWebList.push({ keyword: "site_gallery", name: "Site Gallery" });
        }
        this.sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'assets/icons/sidebar/website.svg', sub: webList });
        userPermList.push({ title: "WEBSITE", sub_list: tempWebList });
        // store apps
        let moduleList: IChildItem[] = []; let tempModuleList = [];
        if(ysFeatures.indexOf('shopping_assistant')!=-1) {
          moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/setting/shop-assistant', type: 'link' });
          routePermissionList.push("shopping_assistant");
          tempModuleList.push({ keyword: "shopping_assistant", name: "Shopping Assistant" });
        }
        if(ysFeatures.indexOf('vendors')==-1 && ysFeatures.indexOf('sizing_assistant')!=-1) {
          moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/setting/sizing-assistant', type: 'link' });
          routePermissionList.push("sizing_assistant");
          tempModuleList.push({ keyword: "sizing_assistant", name: "Sizing Assistant" });
        }
        if(ysFeatures.indexOf('currency_variation')!=-1) {
          moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setting/currency-types', type: 'link' });
          routePermissionList.push("currency_types");
          tempModuleList.push({ keyword: "currency_variation", name: "Currency Convertor" });
        }
        if(ysFeatures.indexOf('blogs')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/setting/blogs', type: 'link' });
          moduleList.push({ icon: 'group', name: 'Blog Authors', state: '/setting/blogs-authors', type: 'link' });
          routePermissionList.push("blogs", "blog_authors");
          tempModuleList.push({ keyword: "blogs", name: "Blogs" });
          tempModuleList.push({ keyword: "blog_authors", name: "Blog Authors" });
          if(environment.config_data.adv_blogs.indexOf(this.commonService.store_details._id)!=-1) {
            moduleList.push({ icon: 'art_track', name: 'Advanced Blogs', state: '/setting/advanced-blogs', type: 'link' });
            routePermissionList.push("advanced_blogs");
            tempModuleList.push({ keyword: "advanced_blogs", name: "Advanced Blogs" });
          }
        }
        if(ysFeatures.indexOf('articles')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Articles', state: '/setting/articles', type: 'link' });
          routePermissionList.push("articles");
          tempModuleList.push({ keyword: "articles", name: "Articles" });
        }
        if(ysFeatures.indexOf('recipes')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Recipes', state: '/setting/recipes', type: 'link' });
          routePermissionList.push("recipes");
          tempModuleList.push({ keyword: "recipes", name: "Recipes" });
        }
        if(ysFeatures.indexOf('web_stories')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Web Stories', state: '/features/web-stories', type: 'link' });
          routePermissionList.push("web_stories");
          tempModuleList.push({ keyword: "web_stories", name: "Web Stories" });
        }
        if(ysFeatures.indexOf('collections')!=-1) {
          moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/setting/collections', type: 'link' });
          routePermissionList.push("collections");
          tempModuleList.push({ keyword: "collections", name: "Collections" });
        }
        // if(ysFeatures.indexOf('dinamic_offers')!=-1) {
        //   moduleList.push({ icon: 'local_dining', name: 'DiNAMIC Offers', state: '/features/dinamic-offers', type: 'link' });
        //   routePermissionList.push("dinamic_offers");
        //   tempModuleList.push({ keyword: "dinamic_offers", name: "DiNAMIC Offers" });
        // }
        if(ysFeatures.indexOf('appointment_scheduler')!=-1) {
          moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/setting/appointment-categories', type: 'link' });
          routePermissionList.push("appointment_services");
          tempModuleList.push({ keyword: "appointment_services", name: "Appointment Services" });
        }
        if(ysFeatures.indexOf('ad_management')!=-1) {
          moduleList.push({ icon: 'art_track', name: 'Ad Management', state: '/features/ad-management', type: 'link' });
          routePermissionList.push("ad_management");
          tempModuleList.push({ keyword: "ad_management", name: "Ad Management" });
        }
        if(moduleList.length) this.sidePanelList.push({ name: 'Store Apps', type: 'dropDown', icon: 'assets/icons/sidebar/store-module.svg', sub: moduleList });
        if(tempModuleList.length) userPermList.push({ title: "STORE APPS", sub_list: tempModuleList });
        // setting
        let settingList: IChildItem[] = []; let tempSettingList = [];
        if(ysFeatures.indexOf('tax_rates')!=-1) {
          settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/setting/tax-rates', type: 'link' });
          routePermissionList.push("tax_rates");
          tempSettingList.push({ keyword: "tax_rates", name: "Tax Rates" });
        }
        if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type=='order') {
          if(ysFeatures.indexOf('courier_partners')!=-1) routePermissionList.push("courier_partners");
          if(ysFeatures.indexOf('pincode_service')!=-1) routePermissionList.push("pincodes");
          if(ysFeatures.indexOf('time_based_delivery')!=-1) {
            settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/setting/delivery-methods', type: 'link' });
            routePermissionList.push("delivery_methods");
            tempSettingList.push({ keyword: "delivery_methods", name: "Delivery Methods" });
          }
          else if(this.commonService.store_details.type!='estates') {
            settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/setting/shipping-methods', type: 'link' });
            routePermissionList.push("shipping_methods");
            tempSettingList.push({ keyword: "shipping_methods", name: "Shipping Methods" });
          }
        }
        if(this.commonService.store_details.type!='estates') {
          if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type!='enquiry') {
            settingList.push({ icon: 'payment', name: 'Payment Gateway', state: '/setting/payment-gateway', type: 'link' });
            routePermissionList.push("payment_gateway");
            tempSettingList.push({ keyword: "payment_gateway", name: "Payment Gateway" });
          }
        }
        settingList.push({ icon: 'room_preferences', name: 'Store Settings', state: '/setting/store', type: 'link' });
        routePermissionList.push("store_setting");
        tempSettingList.push({ keyword: "store_setting", name: "Store Settings" });
        if(this.commonService.store_details.type=='quot_based') {
          settingList.push({ icon: 'room_preferences', name: 'B2B Configuration', state: '/setting/store-config', type: 'link' });
        }
        if(this.commonService.store_details._id==environment.config_data.chettinad_id) {
          settingList.push({ icon: 'room_preferences', name: 'Notification', state: '/setting/notification', type: 'link' });
        }
        if(settingList.length > 1)
          this.sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'assets/icons/sidebar/settings.svg', sub: settingList });
        else if(settingList.length)
          this.sidePanelList.push({ name: 'Settings', type: 'link', icon: 'assets/icons/sidebar/settings.svg', state: settingList[0].state });
        if(tempSettingList.length) userPermList.push({ title: "SETTINGS", sub_list: tempSettingList });
        // my account
        routePermissionList.push("deployment", "billing");
        let accountList: IChildItem[] = []; let tempAccList = [];
        accountList.push({ icon: 'account_circle', name: 'Profile', state: '/account/profile', type: 'link' });
        if(ysFeatures.indexOf('store_pickup')!=-1) {
          let branchUrl = '/account/branches';
          if(ysFeatures.indexOf('branch_stock')!=-1) branchUrl = '/account/store-branches';
          accountList.push({ icon: 'store', name: 'Branches', state: branchUrl, type: 'link' });
          routePermissionList.push("branches");
          tempAccList.push({ keyword: "branches", name: "Branches" });
        }
        if(ysFeatures.indexOf('1_staff')!=-1 || ysFeatures.indexOf('5_staff')!=-1 || ysFeatures.indexOf('10_staff')!=-1 || ysFeatures.indexOf('20_staff')!=-1) {
          accountList.push({ icon: 'supervised_user_circle', name: 'Users', state: '/account/users', type: 'link' });
          routePermissionList.push("sub_users", "user_roles");
        }
        if(this.commonService.store_details?.type=='multi_vendor') {
          accountList.push({ icon: 'account_balance_wallet', name: 'Wallet', state: '/account/wallet', type: 'link' });
          routePermissionList.push("store_wallet");
        }
        if(this.commonService.master_token || environment.config_data.demo_store.indexOf(this.commonService.store_details?._id)!=-1) {
          accountList.push({ icon: 'widgets', name: 'App Store', state: '/account/app-store', type: 'link' });
          routePermissionList.push("app_store");
        }
        accountList.push({ icon: 'receipt_long', name: 'Billing', state: '/account/billing', type: 'link' });
        accountList.push({ icon: 'support', name: 'Support', state: '/support/creating-your-account', type: 'link' });
        this.commonService.account_menu_list = accountList;
        this.sidePanelList.push({
          name: 'My Account', type: 'dropDown', icon: 'assets/icons/sidebar/account.svg',
          sub: accountList, hidden_routes: ['/deployment', '/account', '/support']
        });
        // vendors
        if(ysFeatures.indexOf('vendors')!=-1) {
          routePermissionList.push("vendors", "vendor_settlement");
          tempAccList.push({ keyword: "vendors", name: "Vendors" });
          let venSubs = [
            { icon: 'supervisor_account', name: 'Manage Vendors', state: '/vendors/list', type: 'link' },
            { icon: 'paid', name: 'Vendor Settlements', state: '/vendors/settlement', type: 'link' }
          ];
          if(ysFeatures.indexOf('vendor_subs')!=-1) {
            routePermissionList.push("vendor_subs");
            venSubs.push({ icon: 'paid', name: 'Vendor Subscriptions', state: '/vendors/payments', type: 'link' });
          }
          this.sidePanelList.push({name: 'Vendors', type: 'dropDown', icon: 'assets/icons/sidebar/account.svg', sub: venSubs });
        }
        userPermList.push({ title: "MY ACCOUNT", sub_list: tempAccList });
        // others
        let othersList = [];
        if(ysFeatures.indexOf('vendors')==-1 && ysFeatures.indexOf('manual_order')!=-1) othersList.push({ keyword: "manual_order", name: "Create Manual Order" });
        if(ysFeatures.indexOf('manual_giftcard')!=-1) othersList.push({ keyword: "manual_giftcard", name: "Create Manual Giftcard" });
        othersList.push(
          { keyword: "product_export", name: "Product Export" },
          { keyword: "order_export", name: "Order Export" }
        );
        userPermList.push({ title: "OTHERS", sub_list: othersList })
      }
      else routePermissionList.push("deployment", "billing");
    }
    // Sub User
    else if(this.commonService.store_details.login_type=='subuser') {
      if(ysFeatures.indexOf('custom_model_history')!=-1) routePermissionList.push("custom_model_history");
      if(ysFeatures.indexOf('reward_points')!=-1) routePermissionList.push("reward_history");
      this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'assets/icons/sidebar/dashboard.svg', state: '/dashboard' });
      routePermissionList.push("dashboard");
      // products
      this.commonService.product_menu_list = [];
      if(subuserFeatures.indexOf('products')!=-1) {
        routePermissionList.push("products", "product_add", "product_edit");
        this.commonService.product_menu_list.push({ name: 'Products', state: '/product-sections/products' });
      }
      // catalogs
      if(subuserFeatures.indexOf('catalogs')!=-1) {
        routePermissionList.push("catalogs");
        this.commonService.product_menu_list.push({ name: 'Catalogs', state: '/product-sections/catalogs' });
      }
      // product extras
      this.commonService.product_extras_list = [];
      if(ysFeatures.indexOf('addon_products')!=-1 && subuserFeatures.indexOf('addon_products')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Addon Products', state: '/product-extras/addon-products', type: 'link', icon:'shopping_basket' });
        routePermissionList.push("addon_products");
      }
      else {
        if(ysFeatures.indexOf('measurements')!=-1 && subuserFeatures.indexOf('measurements')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link', icon:'straighten' });
          routePermissionList.push("measurements");
        }
        if(ysFeatures.indexOf('addons')!=-1 && subuserFeatures.indexOf('addons')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Addons', state: '/product-extras/addons', type: 'link', icon:'shopping_basket' });
          routePermissionList.push("addons");
        }
      }
      if(ysFeatures.indexOf('product_filters')!=-1 && subuserFeatures.indexOf('product_filters')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Product Tags', state: '/product-extras/product-tags', type: 'link', icon:'label' });
        if (isTulsiAiStore) {
          this.commonService.product_extras_list.push({ name: 'AI Catalogue Mapping', state: '/product-extras/catalogue-mapping', type: 'link', icon:'auto_awesome' });
        }
        routePermissionList.push("tags");
      }
      if(ysFeatures.indexOf('foot_note')!=-1 && subuserFeatures.indexOf('foot_note')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link', icon:'description' });
        routePermissionList.push("foot_note");
      }
      if(ysFeatures.indexOf('size_chart')!=-1 && subuserFeatures.indexOf('size_chart')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link', icon:'insert_chart' });
        routePermissionList.push("size_chart");
      }
      if(ysFeatures.indexOf('faq')!=-1 && subuserFeatures.indexOf('faq')!=-1) {
        this.commonService.product_extras_list.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link', icon:'quiz' });
        routePermissionList.push("faq");
      }
      if(ysFeatures.indexOf('image_label')!=-1 && subuserFeatures.indexOf('image_label')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Image Tags', state: '/product-extras/image-tags', type: 'link', icon:'photo_album' });
        routePermissionList.push("image_tag");
      }
      if(ysFeatures.indexOf('variant_colors')!=-1 && subuserFeatures.indexOf('variant_colors')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Variant Colors', state: '/product-extras/variant-colors', type: 'link', icon:'palette' });
        routePermissionList.push("variant_colors");
      }
      if(ysFeatures.indexOf('amenities')!=-1 && subuserFeatures.indexOf('amenities')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Amenities', state: '/product-extras/amenities', type: 'link', icon:'image_search' });
        routePermissionList.push("amenities");
      }
      if(subuserFeatures.indexOf('product_taxonomy')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Product Taxonomy', state: '/product-extras/product-taxonomy', type: 'link', icon:'group_work' });
        routePermissionList.push("product_taxonomy");
      }
      if(subuserFeatures.indexOf('bulk_upload')!=-1) {
        this.commonService.product_extras_list.push({ name: 'Image Uploader', state: '/product-extras/image-gallery', type: 'link', icon:'photo_library' });
        routePermissionList.push("bulk_upload");
      }
      if(this.commonService.product_extras_list.length) {
        this.commonService.product_menu_list.push({ name: 'Product Extras', state: '/product-sections/extras' });
      }
      if(ysFeatures.indexOf('product_archive')!=-1 && subuserFeatures.indexOf('product_archive')!=-1) {
        routePermissionList.push("product_archive");
        this.commonService.product_menu_list.push({ name: 'Archived Products', state: '/product-sections/archive' });
      }
      if(ysFeatures.indexOf('product_reviews')!=-1 && subuserFeatures.indexOf('product_reviews')!=-1) {
        routePermissionList.push("product_reviews");
        this.commonService.product_menu_list.push({ name: 'Product Reviews', state: '/product-sections/reviews' });
      }
      if(this.commonService.product_menu_list.length) {
        this.sidePanelList.push({ name: 'Products', type: 'link', icon: 'assets/icons/sidebar/products.svg', state: '/product-sections', hidden_routes: ['/product-extras'] });
      }
      // quotations
      // if(this.commonService.store_details.type == 'quot_based') {
      //   let quotList: IChildItem[] = [
      //     { icon: 'slow_motion_video', name: 'Live Requests', state: '/quotations/live/all', type: 'link' },
      //     { icon: 'check_circle_outline', name: 'Confirmed Requests', state: '/quotations/confirmed/all', type: 'link' },
      //     { icon: 'highlight_off', name: 'Cancelled Requests', state: '/quotations/cancelled/all', type: 'link' },
      //     { icon: 'no_sim', name: 'Abandoned Quotes', state: '/abandoned-quotes', type: 'link' }
      //   ];
      //   this.sidePanelList.push({ name: 'Quotes', type: 'dropDown', icon: 'description', sub: quotList });
      //   routePermissionList.push("quotations", "abandoned_quotes");
      // }
      // live orders
      let orderList: IChildItem[] = [];
      if(subuserFeatures.indexOf('live_orders')!=-1)
        orderList.push({ icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' });
      // abandoned
      if(this.commonService.store_details.type!='quot_based' && ysFeatures.indexOf('abandoned_cart')!=-1 && subuserFeatures.indexOf('abandoned_cart')!=-1) {
        orderList.push({ name: 'Abandoned Cart', type: 'dropDown', icon: 'remove_shopping_cart', state: '/orders/abandoned-cart', sub: [
          { name: 'Signed Up Users', state: '/orders/abandoned-cart/customer', type: 'link' },
          { name: 'Guest Users', state: '/orders/abandoned-cart/guest-user', type: 'link' }
        ] });
        routePermissionList.push("abandoned_cart");
      }
      // inactive orders
      if(this.commonService.store_details.type!='quot_based' && subuserFeatures.indexOf('inactive_orders')!=-1) {
        orderList.push({ icon: 'error_outline', name: 'Failed Payments', state: '/orders/product/inactive/all', type: 'link' });
        routePermissionList.push("inactive_orders");
      }
      // quick order
      if(this.commonService.store_details.type!='quot_based' && ysFeatures.indexOf('quick_order')!=-1 && subuserFeatures.indexOf('quick_order')!=-1) {
        orderList.push({ icon: 'timer', name: 'Quick Orders', state: '/orders/quick-orders', type: 'link' });
        routePermissionList.push("quick_order");
      }
      // gift card
      if(ysFeatures.indexOf('manual_giftcard')!=-1 || ysFeatures.indexOf('giftcard')!=-1) {
        if(subuserFeatures.indexOf('giftcard_orders')!=-1) {
          orderList.push({ icon: 'redeem', name: 'Gift Card Orders', state: '/orders/gift-coupon', type: 'link' });
          routePermissionList.push("giftcard_orders");
        }
      }
      // appointments
      if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
        orderList.push({ icon: 'book_online', name: 'Appointments', state: '/orders/appointments', type: 'link' });
        routePermissionList.push("appointments");
      }
      // completed orders
      if(subuserFeatures.indexOf('completed_orders')!=-1)
        orderList.push({ icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' });
      // cancelled orders
      if(subuserFeatures.indexOf('cancelled_orders')!=-1)
        orderList.push({ icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' });
      if(subuserFeatures.indexOf('live_orders')!=-1 || subuserFeatures.indexOf('completed_orders')!=-1 || subuserFeatures.indexOf('cancelled_orders')!=-1)
        routePermissionList.push("orders");
      if(orderList.length) {
        this.commonService.order_menu_list = orderList;
        this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'assets/icons/sidebar/orders.svg', sub: orderList });
        routePermissionList.push("orders");
      }
      if(ysFeatures.indexOf('manual_order')!=-1 && subuserFeatures.indexOf('manual_order')!=-1) routePermissionList.push("manual_order");
      // marketing tools
      let toolList: IChildItem[] = [];
      if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type=='order') {
        if(ysFeatures.indexOf('basic_discount')!=-1 || ysFeatures.indexOf('advanced_discount')!=-1) {
          if(subuserFeatures.indexOf('offers')!=-1) {
            toolList.push({ icon: 'local_offer', name: 'Offers', state: '/setting/coupon-codes', type: 'link' });
            routePermissionList.push("offers");
          }
        }
      }
      if(ysFeatures.indexOf('giftcard')!=-1 && subuserFeatures.indexOf('giftcard')!=-1) {
        toolList.push({ icon: 'redeem', name: 'Gift Cards', state: '/setting/giftcard', type: 'link' });
        routePermissionList.push("giftcard");
      }
      if(ysFeatures.indexOf('newsletter')!=-1 && subuserFeatures.indexOf('newsletter')!=-1) {
        toolList.push({ icon: 'mail', name: 'Newsletter', state: '/setting/newsletter', type: 'link' });
        routePermissionList.push("newsletter");
      }
      if(ysFeatures.indexOf('customer_feedback')!=-1 && subuserFeatures.indexOf('customer_feedback')!=-1) {
        toolList.push({ icon: 'feedback', name: 'Feedback', state: '/setting/feedback', type: 'link' });
        routePermissionList.push("feedback");
      }
      // customer
      if(subuserFeatures.indexOf('customers')!=-1) {
        toolList.push({ name: 'Customers', type: 'dropDown', icon: 'supervisor_account', state: '/setting/customers', sub: [
          { name: 'Signed Up Users', state: '/setting/customers/signup-user', type: 'link' },
          { name: 'Guest Users', state: '/setting/customers/guest-users', type: 'link' }
        ] });
        routePermissionList.push("customers");
      }
      if(toolList.length) this.sidePanelList.push({ name: 'Marketing Tools', type: 'dropDown', icon: 'assets/icons/sidebar/marketing-new.svg', sub: toolList });
      // website
      let webList: IChildItem[] = [];
      if(subuserFeatures.indexOf('home_layout')!=-1) {
        webList.push({ icon: 'format_paint', name: 'Home Page', state: '/setup/layouts/home', type: 'link' });
        routePermissionList.push("home_layout");
      }
      if(ysFeatures.indexOf('single_menu')!=-1 || ysFeatures.indexOf('multi_menu')!=-1) {
        if(subuserFeatures.indexOf('menu')!=-1) {
          webList.push({ icon: 'menu_book', name: 'Header Navigation', state: '/features/menus', type: 'link' });
          routePermissionList.push("menus");
        }
      }
      if(subuserFeatures.indexOf('store_setting')!=-1) {
        webList.push({ name: 'Announcement Bar', type: 'link', icon: 'menu_book', state: '/setup/announcement-bar' });
        routePermissionList.push("announce_bar");
        if(ysFeatures.indexOf('whatsapp_chat')!=-1 || ysFeatures.indexOf('messenger')!=-1) {
          webList.push({ name: 'Chat Configuration', type: 'link', icon: 'menu_book', state: '/setup/chat-configuration' });
          routePermissionList.push("chat_config");
        }
        if(ysFeatures.indexOf('newsletter')!=-1) {
          webList.push({ name: 'Newsletter & Popup', type: 'link', icon: 'menu_book', state: '/setup/store-popup' });
          routePermissionList.push("store_popup");
        }
        if(ysFeatures.indexOf('product_search')!=-1) {
          webList.push({ name: 'Search Keywords', type: 'link', icon: 'menu_book', state: '/setup/search-keywords' });
          routePermissionList.push("search_keywords");
        }
      }
      if(subuserFeatures.indexOf('policies')!=-1) {
        webList.push({ name: 'Policies', type: 'link', icon: 'policy', state: '/setup/policies' });
        routePermissionList.push("policies");
      }
      if(subuserFeatures.indexOf('seo')!=-1) {
        webList.push({ name: 'Store SEO', type: 'link', icon: 'track_changes', state: '/setup/seo/store' });
        routePermissionList.push("store_seo");
      }
      let pageStatus = false;
      if(subuserFeatures.indexOf('contact_page')!=-1) {
        pageStatus = true;
        routePermissionList.push("contact_page");
      }
      if(ysFeatures.indexOf('store_locator')!=-1 && subuserFeatures.indexOf('store_locator')!=-1) {
        pageStatus = true;
        routePermissionList.push("store_locator");
      }
      if(ysFeatures.indexOf('extra_pages')!=-1 && subuserFeatures.indexOf('extra_pages')!=-1) {
        pageStatus = true;
        routePermissionList.push("extra_pages");
      }
      if(subuserFeatures.indexOf('catalog_page')!=-1) {
        pageStatus = true;
        routePermissionList.push("catalog_page");
      }
      if(pageStatus) {
        webList.push({ icon: 'contact_phone', name: 'Pages', state: '/setup/pages', type: 'link' });
        routePermissionList.push("pages");
      }
      if(subuserFeatures.indexOf('footer_configuration')!=-1) {
        webList.push({ icon: 'wysiwyg', name: 'Footer Configuration', state: '/setup/footer-content', type: 'link' });
        routePermissionList.push("footer_content");
      }
      if(subuserFeatures.indexOf('footer_seo_links')!=-1) {
        webList.push({ icon: 'track_changes', name: 'Footer SEO Links', state: '/setup/footer-seo-links', type: 'link' });
        routePermissionList.push("footer_seo_links");
      }
      if(webList.length) this.sidePanelList.push({ name: 'Website', type: 'dropDown', icon: 'assets/icons/sidebar/website.svg', sub: webList });
      // store apps
      let moduleList: IChildItem[] = [];
      if(ysFeatures.indexOf('shopping_assistant')!=-1 && subuserFeatures.indexOf('shopping_assistant')!=-1) {
        moduleList.push({ icon: 'assistant', name: 'Shopping Assistant', state: '/setting/shop-assistant', type: 'link' });
        routePermissionList.push("shopping_assistant");
      }
      if(ysFeatures.indexOf('vendors')==-1 && ysFeatures.indexOf('sizing_assistant')!=-1 && subuserFeatures.indexOf('sizing_assistant')!=-1) {
        moduleList.push({ icon: 'straighten', name: 'Sizing Assistant', state: '/setting/sizing-assistant', type: 'link' });
        routePermissionList.push("sizing_assistant");
      }
      if(ysFeatures.indexOf('currency_variation')!=-1 && subuserFeatures.indexOf('currency_variation')!=-1) {
        moduleList.push({ icon: 'attach_money', name: 'Currency Convertor', state: '/setting/currency-types', type: 'link' });
        routePermissionList.push("currency_types");
      }
      if(ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('blogs')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Blogs', state: '/setting/blogs', type: 'link' });
        moduleList.push({ icon: 'group', name: 'Blog Authors', state: '/setting/blogs-authors', type: 'link' });
        routePermissionList.push("blogs", "blog_authors");
      }
      if(environment.config_data.adv_blogs.indexOf(this.commonService.store_details._id)!=-1 && ysFeatures.indexOf('blogs')!=-1 && subuserFeatures.indexOf('advanced_blogs')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Advanced Blogs', state: '/setting/advanced-blogs', type: 'link' });
        routePermissionList.push("advanced_blogs");
      }
      if(ysFeatures.indexOf('articles')!=-1 && subuserFeatures.indexOf('articles')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Articles', state: '/setting/articles', type: 'link' });
        routePermissionList.push("articles");
      }
      if(ysFeatures.indexOf('recipes')!=-1 && subuserFeatures.indexOf('recipes')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Recipes', state: '/setting/recipes', type: 'link' });
        routePermissionList.push("recipes");
      }
      if(ysFeatures.indexOf('web_stories')!=-1 && subuserFeatures.indexOf('web_stories')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Web Stories', state: '/features/web-stories', type: 'link' });
        routePermissionList.push("web_stories");
      }
      if(ysFeatures.indexOf('collections')!=-1 && subuserFeatures.indexOf('collections')!=-1) {
        moduleList.push({ icon: 'view_carousel', name: 'Collections', state: '/setting/collections', type: 'link' });
        routePermissionList.push("collections");
      }
      if(ysFeatures.indexOf('appointment_scheduler')!=-1 && subuserFeatures.indexOf('appointment_scheduler')!=-1) {
        moduleList.push({ icon: 'book_online', name: 'Appointment Services', state: '/setting/appointment-categories', type: 'link' });
        routePermissionList.push("appointment_services");
      }
      if(ysFeatures.indexOf('ad_management')!=-1 && subuserFeatures.indexOf('ad_management')!=-1) {
        moduleList.push({ icon: 'art_track', name: 'Ad Management', state: '/features/ad-management', type: 'link' });
        routePermissionList.push("ad_management");
      }
      if(moduleList.length) this.sidePanelList.push({ name: 'Store Apps', type: 'dropDown', icon: 'assets/icons/sidebar/store-module.svg', sub: moduleList });
      // setting
      let settingList: IChildItem[] = [];
      if(ysFeatures.indexOf('tax_rates')!=-1 && subuserFeatures.indexOf('tax_rates')!=-1) {
        settingList.push({ icon: 'local_atm', name: 'Tax Rates', state: '/setting/tax-rates', type: 'link' });
        routePermissionList.push("tax_rates");
      }
      if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type=='order') {
        if(ysFeatures.indexOf('courier_partners')!=-1 && subuserFeatures.indexOf('courier_partners')!=-1) {
          routePermissionList.push("courier_partners");
        }
        if(ysFeatures.indexOf('pincode_service')!=-1 && subuserFeatures.indexOf('pincode_service')!=-1) {
          routePermissionList.push("pincodes");
        }
        if(ysFeatures.indexOf('time_based_delivery')!=-1 && subuserFeatures.indexOf('time_based_delivery')!=-1) {
          settingList.push({ icon: 'hourglass_top', name: 'Delivery Methods', state: '/setting/delivery-methods', type: 'link' });
          routePermissionList.push("delivery_methods");
        }
        else if(subuserFeatures.indexOf('shipping_methods')!=-1) {
          settingList.push({ icon: 'local_shipping', name: 'Shipping Methods', state: '/setting/shipping-methods', type: 'link' });
          routePermissionList.push("shipping_methods");
        }
      }
      if(this.commonService.store_details.type!='quot_based' || this.commonService.store_details.sub_type!='enquiry') {
        if(subuserFeatures.indexOf('payment_gateway')!=-1) {
          settingList.push({ icon: 'payment', name: 'Payment Gateway', state: '/setting/payment-gateway', type: 'link' });
          routePermissionList.push("payment_gateway");
        }
      }
      if(subuserFeatures.indexOf('store_setting')!=-1) {
        settingList.push({ icon: 'room_preferences', name: 'Store Settings', state: '/setting/store', type: 'link' });
        routePermissionList.push("store_setting");
      }
      if(settingList.length) this.sidePanelList.push({ name: 'Settings', type: 'dropDown', icon: 'assets/icons/sidebar/settings.svg', sub: settingList });
      // my account
      let accountList: IChildItem[] = [];
      if(subuserFeatures.indexOf('branches')!=-1) {
        let branchUrl = '/account/branches';
        if(ysFeatures.indexOf('branch_stock')!=-1) branchUrl = '/account/store-branches';
        accountList.push({ icon: 'store', name: 'Branches', state: branchUrl, type: 'link' });
        routePermissionList.push("branches");
      }
      if(accountList.length) this.sidePanelList.push({ name: 'My Account', type: 'dropDown', icon: 'account_circle', sub: accountList });
      // vendors
      if(ysFeatures.indexOf('vendors')!=-1 && subuserFeatures.indexOf('vendors')!=-1) {
        routePermissionList.push("vendors");
        this.sidePanelList.push({ name: 'Vendors', type: 'link', icon: 'assets/icons/sidebar/account.svg', state: '/vendors/list' });
      }
    }
    // Vendor
    else if(this.commonService.store_details.login_type=='vendor') {
      if(this.commonService.vendor_details.status=='active') {
        this.commonService.subuser_features = ["update_product"];
        // dashboard
        routePermissionList.push("vendor_dashboard");
        this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'assets/icons/sidebar/dashboard.svg', state: '/vendor-dashboard' });
        // products
        this.sidePanelList.push({ name: 'Products', type: 'link', icon: 'assets/icons/sidebar/products.svg', state: '/product-sections/products', hidden_routes: ['/product-extras'] });
        this.commonService.product_menu_list = [{ name: 'Products', state: '/product-sections/products' }];
        routePermissionList.push("products", "product_add", "product_edit");
        // product extras
        this.commonService.product_extras_list = [];
        if(ysFeatures.indexOf('measurements')!=-1 && this.commonService.vendor_features.indexOf('measurements')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Measurement Sets', state: '/product-extras/measurement-sets', type: 'link', icon:'straighten' });
          routePermissionList.push("measurements");
        }
        if(ysFeatures.indexOf('addons')!=-1 && this.commonService.vendor_features.indexOf('addons')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Addons', state: '/product-extras/addons', type: 'link', icon:'shopping_basket' });
          routePermissionList.push("addons");
        }
        if(ysFeatures.indexOf('product_filters')!=-1 && this.commonService.vendor_features.indexOf('product_filters')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Product Tags', state: '/product-extras/product-tags', type: 'link', icon:'label' });
          if (isTulsiAiStore) {
            this.commonService.product_extras_list.push({ name: 'AI Catalogue Mapping', state: '/product-extras/catalogue-mapping', type: 'link', icon:'auto_awesome' });
          }
          routePermissionList.push("tags");
        }
        if(ysFeatures.indexOf('foot_note')!=-1 && this.commonService.vendor_features.indexOf('foot_note')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Footnote', state: '/product-extras/footnote', type: 'link', icon:'description' });
          routePermissionList.push("foot_note");
        }
        if(ysFeatures.indexOf('size_chart')!=-1 && this.commonService.vendor_features.indexOf('size_chart')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Size Chart', state: '/product-extras/size-chart', type: 'link', icon:'insert_chart' });
          routePermissionList.push("size_chart");
        }
        if(ysFeatures.indexOf('faq')!=-1 && this.commonService.vendor_features.indexOf('faq')!=-1) {
          this.commonService.product_extras_list.push({ name: 'FAQ', state: '/product-extras/faq', type: 'link', icon:'quiz' });
          routePermissionList.push("faq");
        }
        if(this.commonService.store_details?.package_details?.package_id!=environment.config_data.free_package_id && this.commonService.vendor_features.indexOf('add_product')!=-1) {
          this.commonService.product_extras_list.push({ name: 'Image Uploader', state: '/product-extras/image-gallery', type: 'link', icon:'photo_library' });
          routePermissionList.push("bulk_upload");
        }
        if(this.commonService.product_extras_list.length) {
          this.commonService.product_menu_list.push({ name: 'Product Extras', state: '/product-sections/extras' });
        }
        // product
        let orderList: IChildItem[] = [
          { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
          { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
          { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
        ];
        routePermissionList.push("orders", "vendor_settlement");
        this.commonService.order_menu_list = orderList;
        this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'assets/icons/sidebar/orders.svg', sub: orderList });
        // managements
        let mList: IChildItem[] = [
          { icon: 'slow_motion_video', name: 'Settlements', state: '/vendors/settlement', type: 'link' }
        ];
        if(ysFeatures.indexOf('ad_management')!=-1) {
          routePermissionList.push("ad_management");
          routePermissionList.push("vendor_wallet");
          mList.push({ icon: 'slow_motion_video', name: 'Ad Management', state: '/features/ad-management', type: 'link' });
        }
        if(ysFeatures.indexOf('vendor_subs')!=-1 && this.commonService.deploy_details?.vendor_subs_status) {
          routePermissionList.push("vendor_billing", "vendor_subs");
          mList.push({ icon: 'slow_motion_video', name: 'Subscriptions', state: '/vendors/payments', type: 'link' });
        }
        this.sidePanelList.push({ name: 'Managements', type: 'dropDown', icon: 'assets/icons/sidebar/store-module.svg', sub: mList });
        // profile
        this.sidePanelList.push({ name: 'My Account', type: 'link', icon: 'assets/icons/sidebar/account.svg', state: '/vendor-account' });
        this.commonService.account_menu_list = [
          { icon: 'account_circle', name: 'Profile', state: '/vendor-account/vendor-profile', type: 'link' },
          { icon: 'paid', name: 'Wallet', state: '/vendor-account/vendor-wallet', type: 'link' },
          { icon: 'support', name: 'Support', state: '/support', type: 'link' }
        ];
        if(routePermissionList.indexOf('vendor_billing')!=-1) {
          this.commonService.account_menu_list.unshift({ icon: 'receipt_long', name: 'Billing', state: '/vendor-account/vendor-billing', type: 'link' })
        }
        routePermissionList.push("vendor_profile");
      }
      else if(this.commonService.vendor_details.status=='expired') routePermissionList.push("vendor_billing");
    }
    // Branch
    else if(this.commonService.store_details.login_type=='branch') {
      this.commonService.subuser_features = ["update_product"];
      // dashboard
      routePermissionList.push("branch_dashboard");
      this.sidePanelList.push({ name: 'Dashboard', type: 'link', icon: 'assets/icons/sidebar/dashboard.svg', state: '/branch-dashboard' });
      // products
      this.sidePanelList.push({ name: 'Products', type: 'link', icon: 'assets/icons/sidebar/products.svg', state: '/product-sections/products', hidden_routes: ['/product-extras'] });
      this.commonService.product_menu_list = [{ name: 'Products', state: '/product-sections/products' }];
      routePermissionList.push("products", "product_edit");
      // product
      let orderList: IChildItem[] = [
        { icon: 'slow_motion_video', name: 'Live Orders', state: '/orders/product/live/all', type: 'link' },
        { icon: 'check_circle_outline', name: 'Completed Orders', state: '/orders/product/delivered/all', type: 'link' },
        { icon: 'highlight_off', name: 'Cancelled Orders', state: '/orders/product/cancelled/all', type: 'link' }
      ];
      routePermissionList.push("orders", "vendor_settlement");
      this.commonService.order_menu_list = orderList;
      this.sidePanelList.push({ name: 'Orders', type: 'dropDown', icon: 'assets/icons/sidebar/orders.svg', sub: orderList });
      // profile
      this.sidePanelList.push({ name: 'My Account', type: 'link', icon: 'assets/icons/sidebar/account.svg', state: '/vendor-account' });
      this.commonService.account_menu_list = [
        { icon: 'account_circle', name: 'Profile', state: '/vendor-account/branch-profile', type: 'link' }
      ];
      routePermissionList.push("branch_profile");
    }
    this.commonService.route_permission_list = routePermissionList;
    this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
    this.commonService.user_permission_list = userPermList;
    this.commonService.updateLocalData('user_permission_list', this.commonService.user_permission_list);
    // announcement bar
    if(this.commonService.store_details?.login_type=='admin' && this.commonService.store_details?.package_info?.category=='pro' && this.commonService.store_details?.signup_by=='self' && !this.commonService.store_details?.package_details?.billing_status) {
      this.commonService.dispAnnouncement = true;
    }
  }

  resetStoreDetails(result) {
    this.commonService.store_details = {
      type: result.data.type,
      sub_type: result.data.sub_type,
      login_email: result.data.email,
      login_type: result.login_type,
      _id: result.data._id,
      login_id: result.data.login_id,
      name: result.data.name,
      email: result.data.email,
      gst_no: result.data.gst_no,
      website: result.data.website,
      base_url: result.data.base_url,
      sub_domain: result.data.sub_domain,
      wallet: result.data.wallet,
      currency_types: result.data.currency_types,
      country: result.data.country,
      created_on: result.data.created_on,
      additional_features: result.data.additional_features,
      company_details: result.data.company_details,
      package_details: result.data.package_details,
      package_info: result.data.package_info,
      signup_by: result.data.signup_by,
      status: result.data.status
    };
    if(result.data.vendor_commission) this.commonService.store_details.vendor_commission = result.data.vendor_commission;
    if(result.data.payout_gateway) this.commonService.store_details.payout_gateway = result.data.payout_gateway;
    if(result.data.wati_config) this.commonService.store_details.wati_config = result.data.wati_config;
    if(new Date("2023-01-01") < new Date(result.data.created_on)) this.commonService.store_details.enable_reset = true;
    this.commonService.updateLocalData('store_details', this.commonService.store_details);
    // socket
    this.io.onCreateRoom({ store_id: this.commonService.store_details.login_id });
    // deploy stages
    this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
    this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
    // deploy details
    this.commonService.deploy_details = result.data.deployDetails[0];
    delete this.commonService.deploy_details.deploy_stages;
    this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
    if(result.data.status=='active') {
      // ys features
      this.commonService.ys_features = result.ys_features;
      // trial features
      let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
      if(trialFeatures.length) {
        trialFeatures.forEach(obj => {
          let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
          if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
            this.commonService.ys_features.push(obj.name);
          }
        });
      }
      this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
      this.getSidePanelList();
    }
    else {
      this.commonService.route_permission_list = ["deployment", "billing"];
      this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
      this.router.navigateByUrl('/account/billing');
    }
  }

}
