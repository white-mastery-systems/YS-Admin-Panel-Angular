import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
    selector: 'app-announcement-bar',
    templateUrl: './announcement-bar.component.html',
    styleUrls: ['./announcement-bar.component.scss'],
    standalone: false
})

export class AnnouncementBarComponent implements OnInit {

  pageLoader: boolean;
  app_setting: any = { announcebar_config: {} };
  productList: any = [];
  curr_date: any = new Date();
  searchLoader: boolean;

  constructor(private datepipe: DatePipe, private api: StoreApiService, public commonService: CommonService, private atp: AmazingTimePickerService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/setup";
		this.commonService.secondary_header = "Announcement Bar";
    this.pageLoader = true;
    this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.pageLoader = false;
        this.app_setting = result.data.application_setting;
        // announcement bar
        if(this.app_setting.announcebar_config) {
          if(this.app_setting.announcebar_config.timer_date) {
            this.app_setting.announcebar_config.end_date = new Date(this.app_setting.announcebar_config.timer_date);
            this.app_setting.announcebar_config.end_time = this.datepipe.transform(new Date(this.app_setting.announcebar_config.timer_date), 'hh:mm a');
          }
          if(this.app_setting.announcebar_config.link_status && this.app_setting.announcebar_config.link_type=='product' && this.app_setting.announcebar_config.product_id) {
            this.api.PRODUCT_DETAILS(this.app_setting.announcebar_config.product_id).subscribe(result => {
              if(result.status) this.productList = [result.data];
              else console.log("response", result);
            });
          }
        }
      }
      else console.log("response", result);
    });
  }

  searchProduct(catId, searchTerm) {
		this.productList = []; this.searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.productList = result.list;
				else console.log("response", result);
				this.searchLoader = false;
			});
		}
	}

  onSubmit() {
    this.app_setting.submit = true;
    if(this.app_setting.announcebar_status && this.app_setting.announcebar_config.timer) {
      let timerDate = this.datepipe.transform(new Date(this.app_setting.announcebar_config.end_date), 'dd MMM y')+" "+this.app_setting.announcebar_config.end_time;
      this.app_setting.announcebar_config.timer_date = new Date(timerDate);
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.announcebar_status": this.app_setting.announcebar_status, "application_setting.announcebar_config": this.app_setting.announcebar_config }).subscribe(result => {
      this.app_setting.submit = false;
      if(!result.status) {
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
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

}