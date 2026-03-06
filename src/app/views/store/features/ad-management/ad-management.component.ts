import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ad-management',
  templateUrl: './ad-management.component.html',
  styleUrls: ['./ad-management.component.scss'],
  animations: [SharedAnimations],
  providers: [AmazingTimePickerService]
})

export class AdManagementComponent implements OnInit {

  page = 1; pageSize = 10;
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;
  list: any = []; segmentList: any = [];
  settingForm: any = {}; deleteForm:any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public api: StoreApiService,
    private atp: AmazingTimePickerService, public commonService: CommonService, private router: Router
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.commonService.redirect = "/setting/store";
    this.commonService.secondary_header = "Ad Management";
    this.pageLoader = true; this.list = []; this.segmentList = [];
    this.api.LAYOUT_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        result.list = result.list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
        // highlights
        result.list.filter(el => el.type=='highlights').forEach(el => {
          el.ad_name = el.ad_config?.name;
          if(el.ad_status) this.list.push(el);
          else this.segmentList.push({ _id: el._id, type: el.type, name: el.name });
        });
        // except highlights
        result.list.filter(el => el.type!='highlights').forEach(el => {
          el.ad_name = el.ad_config?.name;
          if(el.ad_status) this.list.push(el);
          else this.segmentList.push({ _id: el._id, type: el.type, name: el.name });
        });
      }
      else console.log("response", result);
    });
  }

  onAddSegment() {
    sessionStorage.setItem("sList", JSON.stringify(this.segmentList));
    this.router.navigate(['/features/ad-management/add']);
  }

  onUpdateStatus() {
    this.api.UPDATE_AD({ _id: this.deleteForm._id, change_status: true }).subscribe((result) => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else { 
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onDelete() {
    this.api.REMOVE_AD({ _id: this.deleteForm._id }).subscribe((result) => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else { 
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onGetSettingDetails(modalName) {
    this.settingForm = {
      normal_days: [
        { code: 0, day: "Sunday" }, { code: 1, day: "Monday" },
        { code: 2, day: "Tuesday" }, { code: 3, day: "Wednesday" },
        { code: 4, day: "Thursday" }, { code: 5, day: "Friday" },
        { code: 6, day: "Saturday" }
      ],
      peak_days: [
        { code: 0, day: "Sunday" }, { code: 1, day: "Monday" },
        { code: 2, day: "Tuesday" }, { code: 3, day: "Wednesday" },
        { code: 4, day: "Thursday" }, { code: 5, day: "Friday" },
        { code: 6, day: "Saturday" }
      ]
    };
    this.api.AD_SETTING({}).subscribe((result) => {
      if(result.status) {
        if(result.data?.normal_days) {
          this.settingForm.normal_days.forEach(el => {
            if(result.data.normal_days.indexOf(el.code) != -1) el.active = true;
          })
        }
        if(result.data?.peak_days) {
          this.settingForm.peak_days.forEach(el => {
            if(result.data.peak_days.indexOf(el.code) != -1) el.active = true;
          })
        }
        if(result.data?.start_time) this.settingForm.start_time = result.data.start_time;
        if(result.data?.end_time) this.settingForm.end_time = result.data.end_time;
        this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable : true });
      }
      else console.log("response", result);
    });
  }

  onUpdateSetting() {
    let formData = {
      normal_days: [], peak_days: [], start_time: this.settingForm.start_time, end_time: this.settingForm.end_time
    };
    this.settingForm.normal_days.filter(obj => obj.active).forEach(el => {
      formData.normal_days.push(el.code);
    });
    this.settingForm.peak_days.filter(obj => obj.active).forEach(el => {
      formData.peak_days.push(el.code);
    });
    this.settingForm.submit = true;
    this.api.AD_SETTING({ ad_config: formData }).subscribe((result) => {
      this.settingForm.submit = false;
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onDaySelect(dayList, dayCode) {
    let dIndex = dayList.findIndex(obj => obj.code==dayCode && obj.active);
    if(dIndex!=-1) dayList[dIndex].active = false;
  }
  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.settingForm[x] = this.commonService.timeConversion(time);
    });
  }

}