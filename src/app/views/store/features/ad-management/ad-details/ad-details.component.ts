import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})

export class AdDetailsComponent implements OnInit {

  pageLoader: boolean; imgBaseUrl = environment.img_baseurl;
  dayList: any = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  adForm: any = {}; layoutDetails: any = {}; disabledDates: any = [];
  normalDay: any = []; peakDay: any = [];
  dispNormDay: any = []; dispPeakDay: any = [];
  totalNday: number = 0; totalPday: number = 0;
  adConfigDetails: any = {}; currDate: Date = new Date();
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 6));
  adSetting: any = {};

  constructor(
    private api: StoreApiService, private router: Router, private activeRoute: ActivatedRoute,
    public commonService: CommonService, private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/features/ad-management";
      this.commonService.secondary_header = " ";
      if(params.id) {
        this.pageLoader = true; this.adForm= {};
        this.api.LAYOUT_DETAILS(params.id, true).subscribe((result) => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.layoutDetails = result.data;
            this.adSetting = result.ad_setting;
            this.adConfigDetails = this.layoutDetails.ad_config;
            this.commonService.secondary_header = this.adConfigDetails.name;
            this.findDisableDaysList(this.adConfigDetails.disable_dates);
            // store ad config
            this.normalDay = this.adSetting?.normal_days;
            this.peakDay = this.adSetting?.peak_days;
            this.normalDay.forEach(el => {
              this.dispNormDay.push(this.dayList[el]);
            });
            this.peakDay.forEach(el => {
              this.dispPeakDay.push(this.dayList[el]);
            });
          }
          else console.log("response", result);
        });
      }
      else this.router.navigate(['/features/ad-management'])
    });
  }

  onBook() {
    delete this.adForm.errorMsg;
    if(this.adForm.total_price) {
      this.adForm.submit = true;
      this.adForm.segment_id = this.layoutDetails._id;
      let sendData = Object.assign({}, this.adForm);
      sendData.from_date = this.datePipe.transform(sendData.from_date, 'yyyy-MM-dd');
      sendData.to_date = this.datePipe.transform(sendData.from_date, 'yyyy-MM-dd');
      this.api.ADD_AD_ORDERS(sendData).subscribe((result) => {
        this.adForm.submit = false;
        if(result.status) this.router.navigate(['/features/ad-management/orders']);
        else {
          console.log("response", result)
          this.adForm.errorMsg = result.message;
        }
      });
    }
    else {
      this.findDayCount(new Date(this.adForm.from_date), new Date(this.adForm.to_date));
      for(let y of this.disabledDates)
      {
        if(new Date(this.adForm.from_date) < y && new Date(this.adForm.to_date) > y) {
          this.adForm.errorMsg = 'Selected days was not available';
          break;
        }
      }
      if(!this.adForm.errorMsg) {
        this.adForm.total_price = 0;
        this.adForm.total_price += this.totalNday * this.adConfigDetails.normal_price
        this.adForm.total_price += this.totalPday * this.adConfigDetails.peak_price;
      }
    }
  }

  changeDate() {
    delete this.adForm.total_price;
    delete this.adForm.errorMsg;
    if(this.adForm.to_date) {
      this.adForm.temp_to_date = this.adForm.to_date;
      // start time gt end time
      let stDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')+" "+this.adSetting.start_time;
      let enDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')+" "+this.adSetting.end_time;
      if(new Date(stDate) >= new Date(enDate)) {
        this.adForm.temp_to_date = new Date(new Date(this.adForm.to_date).setDate(new Date(this.adForm.to_date).getDate() + 1));
      }
    }
  }

  fileChangeListener(event) {
    if (event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.adForm.image = (<FileReader>event.target).result;
        this.adForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  findDisableDaysList(daysList) {
    this.disabledDates = [];
    for(let i=0; i<daysList.length; i++)
    {
      for(let dt = new Date(daysList[i].from); dt <= new Date(daysList[i].to); dt.setDate(dt.getDate() + 1))
      {
        this.disabledDates.push(new Date(dt));
      }
    }
  }

  findDayCount(start, end) {
    this.totalNday = 0; this.totalPday = 0;
    for(let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1))
    {
      let dayCode = dt.getDay();
      if(this.normalDay.indexOf(dayCode) != -1) this.totalNday++;
      if(this.peakDay.indexOf(dayCode) != -1) this.totalPday++;
    }
  }

}