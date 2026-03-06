import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-store-popup',
  templateUrl: './store-popup.component.html',
  styleUrls: ['./store-popup.component.scss']
})

export class StorePopupComponent implements OnInit {

  pageLoader: boolean;
  app_setting: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(private api: StoreApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/setup";
		this.commonService.secondary_header = "Newsletter & Popup";
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.pageLoader = false;
        this.app_setting = result.data.application_setting;
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.app_setting.submit = true;
    if(!this.app_setting.newsletter_config.subscription_status) this.app_setting.newsletter_config.open_onload = true;
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.newsletter_status": this.app_setting.newsletter_status, "application_setting.newsletter_config": this.app_setting.newsletter_config }).subscribe(result => {
      this.app_setting.submit = false;
      if(!result.status) {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.app_setting.newsletter_config.image = (<FileReader>event.target).result;
        this.app_setting.newsletter_config.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}