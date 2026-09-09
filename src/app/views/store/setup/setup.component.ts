import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss'],
    standalone: false
})

export class SetupComponent implements OnInit {

  list: any = [];
  
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.list = []; 
    // website 
    let wdList = [];
    if(this.commonService.route_permission_list.indexOf('home_layout')!=-1)
      wdList.push({ name: "Home Page", icon: "home", link: "/setup/layouts/home", })
    if(this.commonService.route_permission_list.indexOf('menus')!=-1)
      wdList.push({ name: "Header Navigation", icon: "view_carousel", link: "/features/menus" })
    if(this.commonService.route_permission_list.indexOf('announce_bar')!=-1)
      wdList.push({ name: "Announcement Bar", icon: "announcement", link: "/setup/announcement-bar" })
    if(this.commonService.route_permission_list.indexOf('chat_config')!=-1)
      wdList.push({ name: "Chat Configuration", icon: "insert_comment", link: "/setup/chat-configuration" })
    if(this.commonService.route_permission_list.indexOf('store_popup')!=-1)
      wdList.push({ name: "Newsletter & Popup", icon: "store", link: "/setup/store-popup" })
    if(this.commonService.route_permission_list.indexOf('footer_content')!=-1)
      wdList.push({ name: "Footer Configuration", icon: "wysiwyg", link: "/setup/footer-content" })
    if(wdList.length) this.list.push({ name: "Website Design", menu_list: wdList })
    // policies
    if(this.commonService.route_permission_list.indexOf('policies')!=-1) {
      let pList = [
        { name: "Privacy Policy", icon: "policy", link: "/setup/policies/privacy" },
        { name: "Shipping Policy", icon: "local_shipping", link: "/setup/policies/shipping" },
        { name: "Cancellation Policy", icon: "gpp_bad", link: "/setup/policies/cancellation" },
        { name: "Terms & Conditions", icon: "gavel", link: "/setup/policies/terms_conditions" }
      ];
      this.list.push({ name: "Policies", menu_list: pList });
    }
    // others
    let oList = [];
    if(this.commonService.route_permission_list.indexOf('store_seo')!=-1)
      oList.push({ name: "Store SEO", icon: "store", link: "/setup/seo/store" })
    if(this.commonService.route_permission_list.indexOf('contact_page')!=-1)
      oList.push({ name: "Contact Page", icon: "contact_phone", link: "/setup/pages/contact-page" })
    if(this.commonService.route_permission_list.indexOf('store_locator')!=-1)
      oList.push({ name: "Store Locator", icon: "location_on", link: "/setup/pages/store-locator" })
    if(this.commonService.route_permission_list.indexOf('extra_pages')!=-1)
      oList.push({ name: "Extra Pages", icon: "note_add", link: "/setup/pages/extra-pages" })
    if(this.commonService.route_permission_list.indexOf('search_keywords')!=-1)
      oList.push({ name: "Search Keywords", icon: "manage_search", link: "/setup/search-keywords" })
    if(this.commonService.route_permission_list.indexOf('footer_seo_links')!=-1)
      oList.push({ name: "Footer SEO Links", icon: "wysiwyg", link: "/setup/footer-seo-links" })
    
    if(oList.length) this.list.push({ name: "Others", menu_list: oList })
  }

}