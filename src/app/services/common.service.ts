import { Injectable } from '@angular/core';
import { Location, PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
declare const CryptoJS: any;
declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  ios: boolean;
  dark_theme: boolean;
  desktop_device: boolean;
  isDesktop: boolean;
  copyLink: boolean;
  dispChatBody: boolean;
  dispChatIcon: boolean;
  cFormat: string = '1.0';
  vendor_login_info: any = {};
  toastMsg: any = ''; toastErr: boolean;
  grid_list: any = [
    {
      type: "grid_1", name: "Grid 1", icon: "assets/images/grid/Grid-1.png", status: "enabled",
      resolutions: [{ value: "800 x 800 pixels @72ppi" }, { value: "800 x 800 pixels @72ppi" }]
    },
    {
      type: "grid_2", name: "Grid 2", icon: "assets/images/grid/Grid-2.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_3", name: "Grid 3", icon: "assets/images/grid/Grid-3.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_4", name: "Grid 4", icon: "assets/images/grid/Grid-4.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    },
    {
      type: "grid_5", name: "Grid 5", icon: "assets/images/grid/Grid-5.png", status: "enabled",
      resolutions: [{ value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }]
    },
    {
      type: "grid_6", name: "Grid 6", icon: "assets/images/grid/Grid-6.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    },
    {
      type: "grid_7", name: "Grid 7", icon: "assets/images/grid/Grid-7.png", status: "enabled",
      resolutions: [{ value: "1080 x 1140 pixels @72ppi" }, { value: "1080 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }]
    },
    {
      type: "grid_8", name: "Grid 8", icon: "assets/images/grid/Grid-8.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1100 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" },
        { value: "700 x 1100 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1100 pixels @72ppi" }
      ]
    },
    {
      type: "grid_9", name: "Grid 9", icon: "assets/images/grid/Grid-9.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 1060 pixels @72ppi" },
        { value: "1460 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }
      ]
    },
    {
      type: "grid_10", name: "Grid 10", icon: "assets/images/grid/Grid-10.png", status: "enabled",
      resolutions: [
        { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" },
        { value: "700 x 1060 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }, { value: "700 x 500 pixels @72ppi" }
      ]
    },
    {
      type: "grid_11", name: "Grid 11", icon: "assets/images/grid/Grid-11.png", status: "enabled",
      resolutions: [
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" },
        { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }, { value: "600 x 600 pixels @72ppi" }
      ]
    },
    {
      type: "grid_12", name: "Grid 12", icon: "assets/images/grid/Grid-12.png", status: "enabled",
      resolutions: [{ value: "1080 x 1140 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }, { value: "510 x 540 pixels @72ppi" }]
    }
  ];
  blog_grid_list: any = [
    { type: "grid_1", name: "Grid 1", count: 2, icon: "assets/images/grid/Grid-1.png", status: "enabled" },
    { type: "grid_2", name: "Grid 2", count: 3, icon: "assets/images/grid/Grid-3.png", status: "enabled" },
    { type: "grid_3", name: "Grid 3", count: 4, icon: "assets/images/grid/Grid-5.png", status: "enabled" }
  ];
  gallery_grid_list: any = [
    { type: "grid_1", name: "Grid 1", count: 2, icon: "assets/images/grid/Grid-1.png", status: "enabled" },
    { type: "grid_2", name: "Grid 2", count: 3, icon: "assets/images/grid/Grid-3.png", status: "enabled" },
    { type: "grid_3", name: "Grid 3", count: 4, icon: "assets/images/grid/Grid-5.png", status: "enabled" }
  ];
  insta_grid_list: any = [
    { type: "grid_1", name: "Grid 1", icon: "assets/images/grid/Grid-3.png", status: "enabled" },
    { type: "grid_2", name: "Grid 2", icon: "assets/images/grid/Grid-4.png", status: "enabled" },
    { type: "grid_3", name: "Grid 3", icon: "assets/images/grid/Grid-11.png", status: "enabled" },
    { type: "grid_4", name: "Grid 4", icon: "assets/images/grid/Grid-5.png", status: "enabled" },
    { type: "grid_5", name: "Grid 5", icon: "assets/images/grid/Grid-6.png", status: "enabled" }
  ];
  multi_grid_list: any = [
    { type: "grid_1", name: "Grid 1", count: 2, icon: "assets/images/grid/Grid-1.png", status: "enabled" },
    { type: "grid_2", name: "Grid 2", count: 4, icon: "assets/images/grid/Grid-2.png", status: "enabled" },
    { type: "grid_3", name: "Grid 3", count: 3, icon: "assets/images/grid/Grid-3.png", status: "enabled" },
    { type: "grid_4", name: "Grid 4", count: 6, icon: "assets/images/grid/Grid-4.png", status: "enabled" },
    { type: "grid_5", name: "Grid 5", count: 4, icon: "assets/images/grid/Grid-5.png", status: "enabled" },
    { type: "grid_6", name: "Grid 6", count: 8, icon: "assets/images/grid/Grid-6.png", status: "enabled" },
    { type: "grid_7", name: "Grid 7", count: 9, icon: "assets/images/grid/Grid-11.png", status: "enabled" }
  ];
  default_units: any = [
    { name: "Inches", value: "inches" },
    { name: "Cms", value: "cms" }
  ];
  feature_categories: any = [
    { name: "Customer Service", rank: 1, apps: [] },
    { name: "Fulfilment", rank: 2, apps: [] },
    { name: "Marketing", rank: 3, apps: [] },
    { name: "Sales", rank: 4, apps: [] },
    { name: "Sourcing and selling products", rank: 5, apps: [] },
    { name: "Shipping and Delivery", rank: 6, apps: [] },
    { name: "Store Design", rank: 7, apps: [] },
    { name: "Store management", rank: 8, apps: [] }
  ];
  store_categories: any = [
    { display: "Clothing", name: "clothing", code: "5691" },
    { display: "Jewellery & Accessories", name: "jewellery", code: "8018" },
    { display: "Saree", name: "saree", code: "8248" },
    { display: "Perfume", name: "perfume", code: "5977" },
    { display: "Home decor & Furniture", name: "home_furniture", code: "5712" },
    { display: "Mobile, Computers & Accessories", name: "mobile_computer", code: "5732" },
    { display: "Restaurant & Cafe", name: "restaurant_cafe", code: "5812" },
    { display: "Bakery & Cake shop", name: "bakery_cake_shop", code: "5311" },
    { display: "Footwear & Accessories", name: "footwear", code: "5699" },
    { display: "Beauty & Cosmetics", name: "beauty_cosmetics", code: "5977" },
    { display: "Health & Wellness", name: "health_wellness", code: "5977" },
    { display: "Arts, Crafts and Photography", name: "art_craft_photography", code: "5399" },
    { display: "Grocery store", name: "grocery", code: "5411" },
    { display: "Fruits & Vegetables", name: "fruits_vegetables", code: "5795" },
    { display: "Fresh Chicken, Fish, Meat", name: "chicken_fish_meat", code: "4628" },
    { display: "Local Services", name: "local_services", code: "5399" }
  ];
  package_categories: any = [
    { display: 'Genie', name: 'genie' },
    { display: 'Pro', name: 'pro' }
  ];
  ys_services: any = [
    { display: 'B2C/D2C Ecommerce  (Sell directly to customers)', short_name: "b2c", name: 'order_based' },
    { display: 'B2B & Wholesale Ecommerce (Sell directly to businesses)', short_name: "b2b", name: 'quot_based' },
    // { display: 'Service Ecommerce', short_name: "service", name: 'service_based' },
    { display: 'Multi Vendor Ecommerce', short_name: "vendor", name: 'multi_vendor' }
  ];
  admin_ys_services: any = [
    { display: 'B2C/D2C Ecommerce  (Sell directly to customers)', short_name: "b2c", name: 'order_based' },
    { display: 'B2B & Wholesale Ecommerce (Sell directly to businesses)', short_name: "b2b", name: 'quot_based' },
    { display: 'Service Ecommerce', short_name: "service", name: 'service_based' },
    { display: 'Multi Vendor Ecommerce', short_name: "vendor", name: 'multi_vendor' },
    { display: 'Estates Ecommerce', short_name: "estates", name: 'estates' }
  ];
  lastPackages: any = [
    "5f4cd4c5573e9a1e68023a04", // premium
    "626a6ac4bb6d8c0afb0f9c92", // B2B premium
    "626a6f7abb6d8c0afb0fe5fd", // service growth
    "626ab945bb6d8c0afb162933"  // mv premium
  ];
  colorNames: any = ['Color', 'color', 'Colour', 'colour'];
  host_name: string = window.location.hostname;
  vapidPublicKey: string = "BK7P3Gui8d5itafHsJ0_amZrnaM8lADhEZcQCRrDZBoBEh_33HBiLHBjS0LUk5UP3Zr2xU2tlFS9Ypnv0xJQHNk";
  dispAnnouncement: boolean;

  redirect: string;
  curr_route: string;
  previous_route: string;
  secondary_header: string;
  order_menu_list: any = [];
  product_menu_list: any = [];
  product_extras_list: any = [];
  account_menu_list: any = [];
  notifications: any = [];
  announcements: any = [];
  notifyCount: number = 0;
  annouceCount: number = 0;

  master_token: string;
  store_token: string;
  notification_url: string;
  selected_catalog: string;
  selected_blog_catalog: any;
  selected_article_catalog: any;
  blog_author_list: any = [];

  admin_packages: any = [];
  admin_features: any = [];

  store_list: any = [];
  ys_features: any = [];
  ys_currency_list: any = [];
  subuser_features: any = [];
  vendor_features: any = [];

  store_details: any = {};
  store_currency: any = {};
  subuser_permissions: any = {};
  vendor_details: any = {};

  courier_partners: any = [];
  user_list: any = [];
  shipping_list: any = [];
  vendor_list: any = [];
  recipe_list: any = [];
  currency_types: any = [];
  route_permission_list: any = [];
  user_permission_list: any = [];
  archive_list: any = [];
  country_list: any = [];
  aistyle_list: any = [];
  catalog_list: any = [];
  blog_catalog_list: any = [];
  article_catalog_list: any = [];
  payment_list: any = [];
  ys_payment_list: any = [];
  branch_list: any =[];
  store_branch_list: any =[];
  deploy_stages: any = {};
  deploy_details: any = {};

  page_attr: any;
  product_page_attr: any;
  selected_customer: any;
  custom_model: any;
  alert_popup_content: any;
  
  scroll_y_pos: number; screen_width: number; screen_height: number;
  gsh: number = parseFloat(sessionStorage.getItem("sh"));
  cryptoSecretkey: string = "YoUr065SToRE217C0nTr0I^&$pA^eL%^&KeY";
  socialTypes: any = ["facebook", "instagram", "tiktok", "twitter", "snapchat", "pinterest", "linkedin", "behance", "dribble", "youtube", "whatsapp", "website"];
  verNum: any = new Date().valueOf();
  sessionId: string;

  constructor(private router: Router, private location: Location, private modalService: NgbModal, private platformLocation: PlatformLocation) {
    platformLocation.onPopState(() => this.modalService.dismissAll());
    if(sessionStorage.getItem("ssid")) this.sessionId = sessionStorage.getItem("ssid");
    if(!sessionStorage.getItem("ssid")) {
      this.sessionId = this.randomString(8)+new Date().valueOf()+this.randomString(8);
      sessionStorage.setItem("ssid", this.sessionId);
    }
    if(localStorage.getItem('admin_packages')) this.admin_packages = this.decryptData(localStorage.getItem("admin_packages"));
    if(localStorage.getItem('admin_features')) this.admin_features = this.decryptData(localStorage.getItem("admin_features"));

    if(localStorage.getItem('ys_features')) this.ys_features = this.decryptData(localStorage.getItem("ys_features"));
    if(localStorage.getItem('ys_currency_list')) this.ys_currency_list = this.decryptData(localStorage.getItem("ys_currency_list"));
    if(localStorage.getItem('subuser_features')) this.subuser_features = this.decryptData(localStorage.getItem("subuser_features"));
    if(localStorage.getItem('vendor_features')) this.vendor_features = this.decryptData(localStorage.getItem("vendor_features"));
    if(localStorage.getItem('store_details')) this.store_details = this.decryptData(localStorage.getItem("store_details"));
    if(localStorage.getItem('vendor_details')) this.vendor_details = this.decryptData(localStorage.getItem("vendor_details"));
    if(localStorage.getItem('store_currency')) this.store_currency = this.decryptData(localStorage.getItem("store_currency"));
    if(localStorage.getItem('route_permission_list')) this.route_permission_list = this.decryptData(localStorage.getItem("route_permission_list"));
    if(localStorage.getItem('user_permission_list')) this.user_permission_list = this.decryptData(localStorage.getItem("user_permission_list"));
    
    if(localStorage.getItem('currency_types')) this.currency_types = this.decryptData(localStorage.getItem("currency_types"));
    if(localStorage.getItem('country_list')) this.country_list = this.decryptData(localStorage.getItem("country_list"));

    if(localStorage.getItem('archive_list')) this.archive_list = this.decryptData(localStorage.getItem("archive_list"));
    if(localStorage.getItem('aistyle_list')) this.aistyle_list = this.decryptData(localStorage.getItem("aistyle_list"));
    if(localStorage.getItem('vendor_list')) this.vendor_list = this.decryptData(localStorage.getItem("vendor_list"));
    if(localStorage.getItem('recipe_list')) this.recipe_list = this.decryptData(localStorage.getItem("recipe_list"));
    if(localStorage.getItem('courier_partners')) this.courier_partners = this.decryptData(localStorage.getItem("courier_partners"));
    if(localStorage.getItem('user_list')) this.user_list = this.decryptData(localStorage.getItem("user_list"));
    if(localStorage.getItem('shipping_list')) this.shipping_list = this.decryptData(localStorage.getItem("shipping_list"));
    if(localStorage.getItem('catalog_list')) this.catalog_list = this.decryptData(localStorage.getItem("catalog_list"));
    if(localStorage.getItem('store_branch_list')) this.store_branch_list = this.decryptData(localStorage.getItem("store_branch_list"));
    if(localStorage.getItem('blog_catalog_list')) this.blog_catalog_list = this.decryptData(localStorage.getItem("blog_catalog_list"));
    if(localStorage.getItem('article_catalog_list')) this.article_catalog_list = this.decryptData(localStorage.getItem("article_catalog_list"));
    if(localStorage.getItem('blog_author_list')) this.blog_author_list = this.decryptData(localStorage.getItem("blog_author_list"));
    if(localStorage.getItem('payment_list')) this.payment_list = this.decryptData(localStorage.getItem("payment_list"));
    if(localStorage.getItem('ys_payment_list')) this.ys_payment_list = this.decryptData(localStorage.getItem("ys_payment_list"));
    if(localStorage.getItem('branch_list')) this.branch_list = this.decryptData(localStorage.getItem("branch_list"));
    if(localStorage.getItem('deploy_details')) this.deploy_details = this.decryptData(localStorage.getItem("deploy_details"));
    if(localStorage.getItem('deploy_stages')) this.deploy_stages = this.decryptData(localStorage.getItem("deploy_stages"));

    if(localStorage.getItem('master_token')) this.master_token = localStorage.getItem("master_token");
    if(localStorage.getItem('store_token')) this.store_token = localStorage.getItem("store_token");
  }

  goBack() {
    this.location.back();
  }

  updateLocalData(key: string, value: any) {
    localStorage.setItem(key, this.encryptData(value));
  }

  // Insert/refresh a blog author in the cached list (memory + localStorage) so a
  // newly created author (e.g. auto-created on doc import) shows in the dropdown
  // immediately, without waiting for the list cache to be rebuilt elsewhere.
  mergeBlogAuthor(author: any) {
    if(!author || !author._id) return;
    const list = Array.isArray(this.blog_author_list) ? [...this.blog_author_list] : [];
    const idx = list.findIndex((a) => a && a._id === author._id);
    if(idx === -1) list.push(author);
    else list[idx] = { ...list[idx], ...author };
    this.blog_author_list = list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
    this.updateLocalData('blog_author_list', this.blog_author_list);
  }

  onActivate(event) {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
 }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.cryptoSecretkey).toString();
    } catch (e) {
      console.log("encrypt err-----", e);
    }
  }
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.cryptoSecretkey);
      if(bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log("decrypt err-----", e);
    }
  }

  stripHtml(html) {
    if(html) {
      let tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
    else return "";
  }

  urlFormat(string) {
    string = string.trim().toLowerCase().replace(/[^a-zA-Z0-9- ]/g, "");
    string = string.replace(/ +(?= )/g, "");
    string = string.replace(/[^a-zA-Z0-9]/g, "-");
    string = string.replace("---", "-");
    return string;
  }
  skuFormat(string) {
    if(string) {
      string = string.toString().trim().toUpperCase().replace(/[^a-zA-Z0-9-]/g, "");
      string = string.replace(/ +(?= )/g, "");
      return string;
    }
    else return "";
  }

  changeTheme() {
    if(this.dark_theme) {
      localStorage.setItem("darkSwitch", "true");
      document.body.setAttribute("data-theme", "true")
    }
    else {
      localStorage.removeItem("darkSwitch");
      document.body.removeAttribute("data-theme");
    }
  }

  scrollModalTop(timer: number) {
    setTimeout(() => {
      $('.modal-body').each(function(index, element) {
        let className = 'modal-body'+(index+1);
        element.classList.add(className);
        $("."+className).scrollTop(0);
      });
    }, timer);
  }

  pageTop(x) {
    setTimeout(() => { window.scrollTo({ top: x, behavior: 'smooth' }); }, 500);
  }

  signOut(redirectPath) {
    this.clearData();
    this.router.navigate([redirectPath]);
  }

  clearData() {
    let appToken;
    if(localStorage.getItem('app_token')) appToken = localStorage.getItem('app_token');
    localStorage.clear();
    sessionStorage.clear();
    if(this.country_list?.length) this.updateLocalData('country_list', this.country_list);
    if(appToken) localStorage.setItem('app_token', appToken);

    this.admin_packages = [];
    this.admin_features = [];
    this.ys_features = [];
    this.subuser_features = [];
    this.vendor_features = [];

    delete this.master_token;
    delete this.store_token;
    this.route_permission_list = [];
    this.user_permission_list = [];

    this.store_details = {};
    this.store_currency = {};
    this.vendor_details = {};
    this.subuser_permissions = {};
    this.deploy_stages = {};
    this.deploy_details = {};

    this.vendor_list = [];
    this.shipping_list = [];
    this.archive_list = [];
    this.aistyle_list = [];
    this.catalog_list = [];
    this.blog_catalog_list = [];
    this.article_catalog_list = [];
    this.blog_author_list = [];
    this.payment_list = [];
    this.currency_types = [];
    
    delete this.page_attr;
    delete this.scroll_y_pos;
    delete this.product_page_attr;
    delete this.selected_customer;
    delete this.dispAnnouncement;
  }

  timeConversion(timeString) {
    var H = timeString.substr(0, 2);
    var convertedTime = (H % 12) || 12;
    var h = convertedTime < 10 ? "0"+ convertedTime : convertedTime;
    var ampm = H < 12 ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString;
  }

  uninstallApp(keyword, storeDetails) {
    let paidFeatures = storeDetails.package_details.paid_features;
    if(paidFeatures.indexOf(keyword) == -1) {
      let yIndex = this.ys_features.indexOf(keyword);
      if(yIndex!=-1) {
        this.ys_features.splice(yIndex, 1);
        this.updateLocalData('ys_features', this.ys_features);
        return true;
      }
      else return false;
    }
    else return false;
  }

  openDeployAlertModal(type, content) {
    this.alert_popup_content = {};
    if(type=='logo') {
      this.alert_popup_content = { btn_name: "Add Logo", btn_link: "/setting/store/logo-management" };
    }
    else if(type=='color') {
      this.alert_popup_content = { btn_name: "Set Colors", btn_link: "/setting/store/logo-management" };
    }
    else if(type=='plan') {
      this.alert_popup_content = { btn_name: "Choose Plan", btn_link: "/deployment/plans" };
    }
    this.alert_popup_content.content = content;
    document.getElementById("openDeployAlertModal").click();
  }

  // loadChat() {
  //   if(environment.production) {
  //     if(document.getElementById("zsiqchat")) {
  //       let chatElem = document.getElementById("zsiq_float");
  //       if(chatElem) chatElem.style.setProperty("display", "block", "important");
  //     }
  //     else {
  //       // userInfo
  //       let userInfo = "";
  //       if(localStorage.getItem("store_token") && !this.master_token && this.store_details?.login_type!='vendor') {
  //         userInfo += "$zoho.salesiq.visitor.name('"+this.store_details.company_details?.contact_person+"');";
  //         userInfo += "$zoho.salesiq.visitor.email('"+this.store_details.email+"');";
  //         userInfo += "$zoho.salesiq.visitor.contactnumber('"+this.store_details.company_details?.dial_code+" "+this.store_details.company_details?.mobile+"');";
  //         userInfo += "$zoho.salesiq.visitor.info({'StoreName': '"+this.store_details.name+"', 'Plan': '"+this.store_details.package_info?.name+"', 'LoginBy': '"+this.store_details.login_type+"'});";
  //       }
  //       // initialize chat
  //       let script = document.createElement("script");
  //       script.type = "text/javascript";
  //       script.id = "zsiqchat";
  //       script.innerText = "var $zoho = $zoho || {};";
  //       script.innerText += "$zoho.salesiq = $zoho.salesiq || { widgetcode: 'c6051b13c2c72eca480efb7f07e3463e292eb45a8e9fde9e82e8c5c75189ce0cbb72871a7f2f41422a9e07ca15a7c57dea40a64111af2d06e075eeed1b566493', values:{}, ready:function(){ "+userInfo+" } };";
  //       script.innerText += "var d = document;";
  //       script.innerText += "var s = d.createElement('script');";
  //       script.innerText += "s.type = 'text/javascript';";
  //       script.innerText += "s.id = 'zsiqscript';";
  //       script.innerText += "s.defer = true;";
  //       script.innerText += "s.src = 'https://salesiq.zoho.in/widget';";
  //       script.innerText += "var t = d.getElementsByTagName('script')[0];";
  //       script.innerText += "t.parentNode.insertBefore(s,t);";
  //       document.getElementsByTagName("body")[0].appendChild(script);
  //     }
  //   }
  // }
  // hideChat() {
  //   let chatElem = document.getElementById("zsiq_float");
  //   if(chatElem) chatElem.style.setProperty("display", "none", "important");
  // }

  getCoustomDomain() {
    if(this.store_details?.package_details?.package_id==environment.config_data.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else this.router.navigate(['/setting/domain']);
  }

  onShare(type, url) {
    url = this.store_details?.base_url+'/'+url;
    if(type=='facebook') {
      const navUrl = 'https://www.facebook.com/sharer/sharer.php?u='+url;
      window.open(navUrl , '_blank');
    }
    else if(type=='whatsapp') {
      const navUrl = 'https://web.whatsapp.com/send?text='+url;
      window.open(navUrl , '_blank');
    }
    else if(type=='twitter') {
      const navUrl = 'https://twitter.com/intent/tweet?text='+url;
      window.open(navUrl, '_blank');
    }
    else if(type=='instagram') {
      const navUrl = 'https://instagram.com/accounts/login/?text='+url;
      window.open(navUrl, '_blank');
    }
    else {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.copyLink = true;
    }
  }

  setNotifyData(result) {
    this.notifications = result.list;
    this.announcements = result.announcements;
    this.notifyCount = result.list.filter(el => !el.viewed).length;
    this.annouceCount = result.announcements.filter(el => !el.viewed).length;
  }

  randomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for(let i=0; i<length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } 
    return result;
  }

  SKUFormat(value) {
    let result = '';
    for(var i=0; i<value.length; i++)
    {
      let val = value[i];
      val = val.trim().toUpperCase().replace(/[^a-zA-Z0-9- ]/g, '');
      val = val.replace(/[^a-zA-Z0-9]/g, "-");
      val = val.replace("---", "-");
      result = result.concat(val, '-');
    }
    result = result.slice(0, -1);
    return result;
  }

  clearToast(timer) {
    let interval = setInterval(() => {
      this.toastMsg = '';
      this.toastErr = false;
      clearInterval(interval)
    }, timer)
  }

  handleWheel(event) {
    event.preventDefault();
  }
  
}
