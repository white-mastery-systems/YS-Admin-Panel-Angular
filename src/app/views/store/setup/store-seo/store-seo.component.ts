import { Component, OnInit } from '@angular/core';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-store-seo',
  templateUrl: './store-seo.component.html',
  styleUrls: ['./store-seo.component.scss']
})

export class StoreSeoComponent implements OnInit {

  seoForm: any = {};
  pageLoader: boolean;

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setup";
      if(this.commonService.previous_route && this.commonService.previous_route!='/') this.commonService.redirect = this.commonService.previous_route;
      this.commonService.secondary_header = "Store SEO";
    }
    this.pageLoader = true;
    this.api.STORE_DETAILS().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        let storeDetails = result.data;
        if(storeDetails.seo_details) {
          this.seoForm = storeDetails.seo_details;
          this.seoForm.meta_keyword_list = [];
          if(this.seoForm.meta_keywords.length) {
            this.seoForm.meta_keywords.forEach(obj => {
              this.seoForm.meta_keyword_list.push({display: obj, value: obj});
            });
          }
        }
      }
      else console.log("response", result);
    });
  }

  onUpdate() {
    let seoDetails = {
      tile_color: this.seoForm.tile_color,
      h1_tag: this.seoForm.h1_tag,
      page_title: this.seoForm.page_title,
      meta_desc: this.seoForm.meta_desc,
      meta_keywords: []
    };
    if(this.seoForm.meta_keyword_list) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        seoDetails.meta_keywords.push(obj.value);
      });
    }
    this.seoForm.submit = true;
    this.api.STORE_UPDATE({ seo_details: seoDetails }).subscribe(result => {
      this.seoForm.submit = false;
      if(result.status) this.ngOnInit();
      else {
				this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}