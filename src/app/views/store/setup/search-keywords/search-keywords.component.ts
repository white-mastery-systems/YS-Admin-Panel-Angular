import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-search-keywords',
  templateUrl: './search-keywords.component.html',
  styleUrls: ['./search-keywords.component.scss']
})

export class SearchKeywordsComponent implements OnInit {

  pageLoader: boolean;
  app_setting: any = {};

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/setup";
		this.commonService.secondary_header = "Search Keywords";
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.pageLoader = false;
        this.app_setting = result.data.application_setting;
        // search keywords
        this.app_setting.search_keyword_list = [];
        if(this.app_setting.search_keywords.length) {
          this.app_setting.search_keywords.forEach(obj => {
            this.app_setting.search_keyword_list.push({display: obj, value: obj});
          });
        }
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.app_setting.submit = true;
    let searchKeywords = [];
    if(this.app_setting.search_keyword_list) {
      this.app_setting.search_keyword_list.forEach(obj => {
        searchKeywords.push(obj.value);
      });
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.search_keywords": searchKeywords }).subscribe(result => {
      this.app_setting.submit = false;
      if(!result.status) {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}