import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
  selector: 'app-chat-config',
  templateUrl: './chat-config.component.html',
  styleUrls: ['./chat-config.component.scss']
})

export class ChatConfigComponent implements OnInit {

  pageLoader: boolean;
  app_setting: any = {};

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/setup";
		this.commonService.secondary_header = "Chat Configuration";
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.pageLoader = false;
        this.app_setting = result.data.application_setting;
        if(!this.app_setting.chat_config) this.app_setting.chat_config = {};
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.app_setting.submit = true;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.chat_status": this.app_setting.chat_status, "application_setting.chat_config": this.app_setting.chat_config }).subscribe(result => {
      this.app_setting.submit = false;
      if(!result.status) {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}