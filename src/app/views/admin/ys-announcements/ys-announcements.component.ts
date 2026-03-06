import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ys-announcements',
  templateUrl: './ys-announcements.component.html',
  styleUrls: ['./ys-announcements.component.scss'],
  animations: [SharedAnimations]
})

export class YsAnnouncementsComponent implements OnInit {
  
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;
  baseUrl = environment.base_url;
  pageSize = 10; page = 1; list:any = [];
  proForm: any = {}; deleteForm: any = {};
  maxRank: number = 0;

  constructor(
    private datepipe: DatePipe, public modalService: NgbModal, private adminApi: AdminApiService,
    public commonService: CommonService, private atp: AmazingTimePickerService
  ) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.adminApi.ANNOUNCE_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd(modalName) {
    this.proForm = { form_type: 'add', type: "instant", rank: this.maxRank+1, content: {}, bar_config: {} };
    this.modalService.open(modalName);
  }

  onSubmit() {
    this.proForm.submit = true;
    if(this.proForm.type=='push') {
      this.proForm.bar_config = {};
      this.proForm.content.scheduled_on = new Date(this.datepipe.transform(new Date(this.proForm.notify_date), 'dd MMM y')+' '+this.proForm.notify_time);
      if(!this.proForm.content.pb_status) this.proForm.content.pri_btn = {};
      if(!this.proForm.content.sb_status) this.proForm.content.sec_btn = {};
    }
    else if(this.proForm.type=='bar') {
      this.proForm.content = {};
      if(this.proForm.bar_config?.date_range) {
        this.proForm.bar_config.start_date = new Date(this.datepipe.transform(new Date(this.proForm.start_date), 'dd MMM y')+' '+this.proForm.start_time);
        this.proForm.bar_config.end_date = new Date(this.datepipe.transform(new Date(this.proForm.end_date), 'dd MMM y')+' '+this.proForm.end_time);
      }
    }
    if(this.proForm.form_type=='add') {
      this.adminApi.ADD_ANNOUNCE(this.proForm).subscribe((result) => {
        this.proForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.proForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.adminApi.UPDATE_ANNOUNCE(this.proForm).subscribe((result) => {
        this.proForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.proForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.adminApi.ANNOUNCE_DETAILS(x).subscribe(result => {
      if(result.status) {
        this.proForm = result.data;
        this.proForm.form_type = 'edit';
        this.proForm.prev_rank = this.proForm.rank;
        // push
        if(this.proForm.content?.scheduled_on) {
          this.proForm.notify_date = new Date(this.proForm.content.scheduled_on);
          this.proForm.notify_time = this.datepipe.transform(this.proForm.notify_date, 'hh:mm a');
        }
        if(this.proForm.content?.pri_btn?.name) this.proForm.content.pb_status = true;
        if(this.proForm.content?.sec_btn?.name) this.proForm.content.sb_status = true;
        // bar
        if(this.proForm.bar_config?.start_date) {
          this.proForm.start_date = new Date(this.proForm.bar_config.start_date);
          this.proForm.start_time = this.datepipe.transform(this.proForm.start_date, 'hh:mm a');
        }
        if(this.proForm.bar_config?.end_date) {
          this.proForm.end_date = new Date(this.proForm.bar_config.end_date);
          this.proForm.end_time = this.datepipe.transform(this.proForm.end_date, 'hh:mm a');
        }
        if(!this.proForm.content) this.proForm.content = {};
        if(!this.proForm.bar_config) this.proForm.bar_config = {};
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.adminApi.DELETE_ANNOUNCE(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
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

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.proForm.payload.image = (<FileReader>event.target).result;
        this.proForm.payload.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  timePicker(field) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.proForm[field] = this.commonService.timeConversion(time);
    });
  }

}