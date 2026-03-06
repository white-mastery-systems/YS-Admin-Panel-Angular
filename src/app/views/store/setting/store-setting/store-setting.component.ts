import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-store-setting',
  templateUrl: './store-setting.component.html',
  styleUrls: ['./store-setting.component.scss']
})

export class StoreSettingComponent implements OnInit {

  settingForm: any = {}; pageLoader: boolean;
  mailTypes: any = [
    {
      name: "Gmail", value: "gmail",
      transporter : { host: "smtp.gmail.com", port: 465, secure: true }
    },
    {
      name: "Ezveb", value: "ezveb",
      transporter : { host: "lin.ezveb.com", port: 25, secureConnection: false }
    },
    {
      name: "Godaddy", value: "godaddy",
      transporter : { host: "smtpout.secureserver.net", port: 465, secureConnection: true, service: "Godaddy" }
    },
    {
      name: "Outlook", value: "outlook",
      transporter : { host: "smtp-mail.outlook.com", port: 587, secureConnection: false, tls: { ciphers: "SSLv3" } }
    },
    {
      name: "Roundcube", value: "roundcube",
      transporter : { port: 465, secure: true }
    },
    {
      name: "Zoho", value: "zoho",
      transporter : { port: 465, secure: true }
    }
  ];
  textTypes: any = [
    { name: "Dark", value: "#000" },
    { name: "Light", value: "#fff" }
  ];
  codExist: boolean; app_setting: any;
  checkout_setting: any; productList: any = [];
  curr_date: any = new Date();
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  btnLoader: boolean; invoiceNum: string;
  list: any = []; popupLoader: boolean;
  rewardForm: any = {};  popupForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService,
    private api: StoreApiService, private atp: AmazingTimePickerService, private deployApi: DeploymentService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    setTimeout(() => { this.pageLoader = false; }, 500);
    this.list = [];
    if(!this.commonService.desktop_device) {
      // marketing tools
      let mTools = [];
      if(this.commonService.route_permission_list.indexOf('offers')!=-1)
        mTools.push({ name: "Offers", icon: "sell", link: "/setting/coupon-codes" })
      if(this.commonService.route_permission_list.indexOf('giftcard')!=-1)
        mTools.push({ name: "Gift Cards", icon: "redeem", link: "/setting/giftcard" })
      if(this.commonService.route_permission_list.indexOf('newsletter')!=-1)
        mTools.push({ name: "Newsletter", icon: "mail", link: "/setting/newsletter" })
      if(this.commonService.route_permission_list.indexOf('newsletter')!=-1)
        mTools.push({ name: "Feedback", icon: "rate_review", link: "/setting/feedback" })
      if(this.commonService.route_permission_list.indexOf('customers')!=-1)
        mTools.push({ name: "Customers", icon: "supervisor_account", link: "/setting/customers" })
      if(this.commonService.store_details?.type!='quot_based' || this.commonService.store_details?.sub_type!='enquiry')
      {
        if(this.commonService.route_permission_list.indexOf('customer_enquiry')!=-1)
          mTools.push({ name: "Enquiries", icon: "unknown_document", link: "/enquiries" })
      }
      if(mTools.length) this.list.push({ name: "Marketing Tools", menu_list: mTools })
      // store modules
      let sModules = [];
      if(this.commonService.route_permission_list.indexOf('shopping_assistant')!=-1)
        sModules.push({ name: "Shopping Assistant", icon: "assistant", link: "/setting/shop-assistant" })
      if(this.commonService.route_permission_list.indexOf('sizing_assistant')!=-1)
        sModules.push({ name: "Sizing Assistant", icon: "straighten", link: "/setting/sizing-assistant" })
      if(this.commonService.route_permission_list.indexOf('currency_types')!=-1)
        sModules.push({ name: "Currency Convertor", icon: "currency_exchange", link: "/setting/currency-types" })
      if(this.commonService.route_permission_list.indexOf('blogs')!=-1)
        sModules.push({ name: "Blogs", icon: "article", link: "/setting/blogs" })
      if(this.commonService.route_permission_list.indexOf('recipes')!=-1)
        sModules.push({ name: "Recipes", icon: "local_dining", link: "/setting/recipes" })
      if(this.commonService.route_permission_list.indexOf('discounts_page')!=-1)
        sModules.push({ name: "Catalog Page", icon: "library_books", link: "/setting/catalog-page" })
      if(this.commonService.route_permission_list.indexOf('collections')!=-1)
        sModules.push({ name: "Collections", icon: "format_list_numbered_rtl", link: "/setting/collections" })
      if(this.commonService.route_permission_list.indexOf('appointment_services')!=-1)
        sModules.push({ name: "Appointment Service", icon: "book_online", link: "/setting/appointment-categories" })
      if(this.commonService.route_permission_list.indexOf('ad_management')!=-1)
        sModules.push({ name: "Ad Management", icon: "ads_click", link: "/features/ad-management" })
      if(this.commonService.master_token)
        sModules.push({ name: "App Store", icon: "widgets", link: "/account/app-store" })
      if(sModules.length) this.list.push({ name: "Store Apps", menu_list: sModules })
      // payments and delivery
      let pdList = [];
      if(this.commonService.route_permission_list.indexOf('tax_rates')!=-1)
        pdList.push({ name: "Tax Rates", icon: "local_atm", link: "/setting/tax-rates" })
      if(this.commonService.route_permission_list.indexOf('shipping_methods')!=-1)
        pdList.push({ name: "Shipping Methods", icon: "local_shipping", link: "/setting/shipping-methods" })
      if(this.commonService.route_permission_list.indexOf('delivery_methods')!=-1)
        pdList.push({ name: "Delivery Methods", icon: "local_shipping", link: "/setting/delivery-methods" })
      if(this.commonService.route_permission_list.indexOf('payment_gateway')!=-1)
        pdList.push({ name: "Payment Gateway", icon: "credit_card", link: "/setting/payment-gateway" })      
      if(pdList.length) this.list.push({ name: "Payments and Delivery", menu_list: pdList })
      // vendors
      let vList = [];
      if(this.commonService.route_permission_list.indexOf('vendors')!=-1)
        vList.push({ name: "Manage Vendors", icon: "local_atm", link: "/vendors/list" })
      if(this.commonService.route_permission_list.indexOf('vendor_settlement')!=-1)
        vList.push({ name: "Vendor Settlements", icon: "local_atm", link: "/vendors/settlement" })
      if(this.commonService.route_permission_list.indexOf('vendor_subs')!=-1)
        vList.push({ name: "Vendor Subscriptions", icon: "local_atm", link: "/vendors/payments" })
      if(vList.length) this.list.push({ name: "Vendors", menu_list: vList })
    }
    // load chat
    if(this.commonService.payment_list.findIndex(obj => obj.name=='COD') != -1) this.codExist = true;
  }

  onOpenPopupModal(modalName) {
    this.popupLoader = true; this.popupForm = { hide_type: "", get_order_type: "", sort_by: "recent" };
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        if(result.data.popup_config) this.popupForm = result.data.popup_config;
      }
      else console.log("response", result);
    });
  }
  onUpdatePopup() {
    this.popupForm.submit = true;
    this.api.STORE_UPDATE({ popup_config: this.popupForm }).subscribe((result) => {
      this.popupForm.submit = false;
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.popupForm.errMsg = result.message;
        console.log("response", result);
      }
    })
  }

  onOpenRewardModal(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.deployApi.DEPLOY_DETAILS(this.commonService.store_details?._id).subscribe(result => {
      if(result.status) {
        this.popupLoader = false;
        this.rewardForm = { store_id: this.commonService.store_details._id, reward_config: {}, reward_disc_range:[{}] };
        if(result.data.reward_config) this.rewardForm.reward_config = result.data.reward_config;
        if(result.data.reward_disc_range) this.rewardForm.reward_disc_range = result.data.reward_disc_range;
      }
      else console.log("response", result);
    });
  }
  onUpdateReward() {
    this.rewardForm.submit = true;
    this.deployApi.UPDATE_DEPLOY_DETAILS(this.rewardForm).subscribe(result => {
      this.rewardForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.deploy_details = result.data;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
      }
      else {
        this.rewardForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // opening hrs
  onOpenStoreOpenDaysModal(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        let appSetting = result.data.application_setting;
        this.settingForm = {
          opening_days: result.data.opening_days, sp_slot_duration: appSetting.sp_slot_duration,
          sp_delay_type: appSetting.sp_delay_type, sp_delay_duration: appSetting.sp_delay_duration
        };
        if(!this.settingForm.sp_slot_duration) this.settingForm.sp_slot_duration = 60;
        if(!this.settingForm.sp_delay_type) this.settingForm.sp_delay_type = 'day';
        if(!this.settingForm.sp_delay_duration) this.settingForm.sp_delay_duration = 1;
        if(!this.settingForm.opening_days.length) {
          this.settingForm.opening_days = [
            { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
            { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
            { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
            { code: 6, day: "Saturday", active: false, opening_hrs: [] }
          ];
        }
      }
      else console.log("response", result);
    });
  }
  onUpdateOpenDays() {
    let sendData = {
      opening_days: this.settingForm.opening_days, "application_setting.sp_slot_duration": this.settingForm.sp_slot_duration,
      "application_setting.sp_delay_type": this.settingForm.sp_delay_type, "application_setting.sp_delay_duration": this.settingForm.sp_delay_duration
    };
    this.api.UPDATE_STORE_PROPERTY_DETAILS(sendData).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // mail configuration
  onOpenMailModal(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        this.settingForm = result.data.mail_config;
        if(this.settingForm.transporter?.auth) {
          this.settingForm.username = this.settingForm.transporter.auth.user;
          this.settingForm.password = this.settingForm.transporter.auth.pass;
        }
        this.settingForm.from_name = this.commonService.store_details.name;
        if(this.settingForm.send_from) {
          let splitData = this.settingForm.send_from.split("<");
          this.settingForm.from_name = splitData[0].trim();
        }
        // cc mail
        this.settingForm.cc_mail_list = [];
        if(this.settingForm.cc_mail) {
          this.settingForm.cc_mail.split(',').forEach(obj => {
            obj = obj.trim();
            this.settingForm.cc_mail_list.push({display: obj, value: obj});
          });
        }
        // billing mail
        this.settingForm.billing_mail_list = [];
        if(this.settingForm.billing_mail) {
          this.settingForm.billing_mail.split(',').forEach(obj => {
            obj = obj.trim();
            this.settingForm.billing_mail_list.push({display: obj, value: obj});
          });
        }
        // ad mail
        this.settingForm.ad_mail_list = [];
        if(this.settingForm.ad_mail) {
          this.settingForm.ad_mail.split(',').forEach(obj => {
            obj = obj.trim();
            this.settingForm.ad_mail_list.push({display: obj, value: obj});
          });
        }
        if(this.settingForm.host_type=='roundcube') {
          this.settingForm.mail_domain = this.settingForm.transporter.name;
        }
        if(this.settingForm.host_type=='roundcube' || this.settingForm.host_type=='zoho') {
          this.settingForm.mail_host = this.settingForm.transporter.host;
        }
      }
      else console.log("response", result);
    });
  }
  onUpdateMailConfig() {
    // cc mail
    delete this.settingForm.cc_mail;
    if(this.settingForm.cc_mail_list.length) {
      let mailList = [];
      this.settingForm.cc_mail_list.forEach(obj => {
        mailList.push(obj.value.trim());
      });
      this.settingForm.cc_mail = mailList.join(',');
    }
    // billing mail
    delete this.settingForm.billing_mail;
    if(this.settingForm.billing_mail_list.length) {
      let mailList = [];
      this.settingForm.billing_mail_list.forEach(obj => {
        mailList.push(obj.value.trim());
      });
      this.settingForm.billing_mail = mailList.join(',');
    }
    // ad mail
    delete this.settingForm.ad_mail;
    if(this.settingForm.ad_mail_list.length) {
      let mailList = [];
      this.settingForm.ad_mail_list.forEach(obj => {
        mailList.push(obj.value.trim());
      });
      this.settingForm.ad_mail = mailList.join(',');
    }
    if(this.commonService.store_details?.package_info?.category!='genie') {
      this.settingForm.submit = true;
      let index = this.mailTypes.findIndex(obj => obj.value==this.settingForm.host_type);
      if(index!=-1) {
        this.settingForm.transporter = this.mailTypes[index].transporter;
        this.settingForm.transporter.auth = { user: this.settingForm.username, pass: this.settingForm.password };
        if(this.settingForm.host_type=='roundcube') {
          this.settingForm.transporter.name = this.settingForm.mail_domain;
        }
        if(this.settingForm.host_type=='roundcube' || this.settingForm.host_type=='zoho') {
          this.settingForm.transporter.host = this.settingForm.mail_host;
        }
      }
      else {
        delete this.settingForm.host_type;
        delete this.settingForm.transporter;
      }
      this.settingForm.send_from = this.settingForm.from_name+" <"+this.settingForm.username+">";
      this.api.STORE_UPDATE({ mail_config: this.settingForm }).subscribe(result => {
        if(result.status) document.getElementById('closeModal').click();
        else {
          this.settingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      if(!this.settingForm.cc_mail) this.settingForm.cc_mail = "";
      if(!this.settingForm.ad_mail) this.settingForm.ad_mail = "";
      if(!this.settingForm.billing_mail) this.settingForm.billing_mail = "";
      let sendData = {
        "mail_config.cc_mail": this.settingForm.cc_mail,
        "mail_config.ad_mail": this.settingForm.ad_mail,
        "mail_config.billing_mail": this.settingForm.billing_mail
      };
      this.api.STORE_UPDATE(sendData).subscribe(result => {
        if(result.status) document.getElementById('closeModal').click();
        else {
          this.settingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // invoice configuration
  onOpenInvoiceModal(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        this.app_setting = { invoice_status: result.data.invoice_status, invoice_config: result.data.invoice_config };
        this.invoiceNumFormat();
      }
      else console.log("response", result);
    });
  }
  onUpdateInvoiceConfig() {
    this.api.STORE_UPDATE(this.app_setting).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // packaging charges
  onOpenPackChargeModal(modalName) {
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.popupLoader = true;
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        if(!result.data.packaging_charges) result.data.packaging_charges = {};
        this.app_setting = { packaging_charges: result.data.packaging_charges };
      }
      else console.log("response", result);
    });
  }
  onUpdatePackCharge() {
    this.api.STORE_UPDATE(this.app_setting).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // auto SKU
  onOpenSkuModal(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.deployApi.DEPLOY_DETAILS(this.commonService.store_details?._id).subscribe(result => {
      if(result.status) {
        this.popupLoader = false;
        this.settingForm = { auto_sku: false, sku_config: {} };
        if(result.data.auto_sku) this.settingForm.auto_sku = result.data.auto_sku;
        if(result.data.sku_config) this.settingForm.sku_config = result.data.sku_config;
      }
      else console.log("response", result);
    });
  }
  onUpdateSKU() {
    this.settingForm.submit = true;
    let formData = {
      store_id: this.commonService.store_details._id, auto_sku: this.settingForm.auto_sku,
      sku_config: this.settingForm.sku_config
    };
    this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
      this.settingForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.deploy_details = result.data;
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
      }
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // setting
  onOpenSettingModal(modalName) {
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.popupLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        this.app_setting = result.data.application_setting;
        this.checkout_setting = result.data.checkout_setting;
        // search keywords
        this.app_setting.search_keyword_list = [];
        if(this.app_setting.search_keywords.length) {
          this.app_setting.search_keywords.forEach(obj => {
            this.app_setting.search_keyword_list.push({display: obj, value: obj});
          });
        }
        // newsletter
        if(!this.app_setting.newsletter_config) {
          this.app_setting.newsletter_config = {
            heading: "NEWSLETTER", sub_heading: "Subscribe now to get updates on latest trends and offers", btn_text: "SUBSCRIBE"
          }
        }
        if(!this.app_setting.newsletter_config.link_type) this.app_setting.newsletter_config.link_type = 'internal';
      }
      else console.log("response", result);
    });
  }

  onUpdateStore() {
    if(this.commonService.ys_features.indexOf('customer_feedback')==-1) this.app_setting.feedback = false;
    if(this.commonService.ys_features.indexOf('addons')==-1) this.app_setting.product_addon = false;
    if(this.commonService.ys_features.indexOf('currency_variation')==-1) this.app_setting.hide_currency = false;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ application_setting: this.app_setting }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEnableAdvProdOptions() {
    this.btnLoader = true; let optStatus = true;
    if(this.commonService.store_details?.additional_features?.adv_product_options) optStatus = false;
    this.api.STORE_UPDATE({ "additional_features.adv_product_options": optStatus }).subscribe(result => {
      delete this.btnLoader;
      if(result.status) {
        this.commonService.store_details.additional_features = result.data.additional_features;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
      }
      else console.log("response", result);
    });
  }

  onUpdateCheckout() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ checkout_setting: this.checkout_setting }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.checkout_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateKeywords() {
    let searchKeywords = [];
    if(this.app_setting.search_keyword_list) {
      this.app_setting.search_keyword_list.forEach(obj => {
        searchKeywords.push(obj.value);
      });
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.search_keywords": searchKeywords }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateInvoice() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.invoice_status": this.app_setting.invoice_status, "application_setting.invoice_config": this.app_setting.invoice_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateSocial() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.google_id": this.app_setting.google_id, "application_setting.facebook_id": this.app_setting.facebook_id }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateNewsletter() {
    this.app_setting.submit = true;
    if(!this.app_setting.newsletter_config.subscription_status) this.app_setting.newsletter_config.open_onload = true;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.newsletter_status": this.app_setting.newsletter_status, "application_setting.newsletter_config": this.app_setting.newsletter_config }).subscribe(result => {
      this.app_setting.submit = false;
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateChat() {
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.chat_status": this.app_setting.chat_status, "application_setting.chat_config": this.app_setting.chat_config }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  openingHrsTimePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm.opening_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }
  notifyTimePicker(i) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm.notify_list[i].time = this.commonService.timeConversion(time);
    });
  }
  timePicker() {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.app_setting.announcebar_config.end_time = this.commonService.timeConversion(time);
    });
  }

  enableTimer() {
    if(this.app_setting?.announcebar_config?.timer && !this.app_setting?.announcebar_config?.content.includes("TIMER"))
      this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.trim()+" TIMER";
    else if(!this.app_setting?.announcebar_config?.timer) {
      if(this.app_setting?.announcebar_config?.content.includes(" TIMER"))
        this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.replace(" TIMER", "");
      else if(this.app_setting?.announcebar_config?.content.includes("TIMER "))
        this.app_setting.announcebar_config.content = this.app_setting.announcebar_config.content.replace("TIMER ", "");
    }
  }

  invoiceNumFormat() {
    this.invoiceNum = String(this.app_setting.invoice_config.next_invoice_no).padStart(this.app_setting.invoice_config.min_digit, '0');
  }

  // fileChangeListener(event) {
  //   if(event.target.files && event.target.files[0]) {
  //     let inFile = event.target.files[0];
  //     if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
  //     let reader = new FileReader();
  //     reader.onload = (event: ProgressEvent) => {
  //       this.app_setting.newsletter_config.image = (<FileReader>event.target).result;
  //       this.app_setting.newsletter_config.img_change = true;
  //     }
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  //   else console.log("Invaid file");
  //   }
  // }

  // createSSL() {
  //   this.btnLoader = true;
  //   this.api.CREATE_SSL().subscribe((result) => {
  //     this.btnLoader = false;
  //     console.log("-----", result);
  //   });
  // }

}