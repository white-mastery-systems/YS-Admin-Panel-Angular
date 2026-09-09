import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { AdminApiService } from '../../../../services/admin-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ys-notification-events',
    templateUrl: './ys-notification-events.component.html',
    styleUrls: ['./ys-notification-events.component.scss'],
    standalone: false
})

export class YsNotificationEventsComponent implements OnInit {

  pageLoader: boolean;
  params: any = {}; notForm: any = {};
  imgBaseUrl = environment.img_baseurl;
  baseUrl = environment.base_url;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private adminApi: AdminApiService,
    private datepipe: DatePipe, public commonService: CommonService, private atp: AmazingTimePickerService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      this.notForm = { notify_type: "push", trigger_type: "instant", recurring_by: "hour", send_to: "", payload: { url: "" }, payload_list: [{ url: "" }] };
        // EDIT
        if(this.params.id) {
          this.pageLoader = true;
          this.adminApi.NOTIFY_DETAILS(this.params.id).subscribe(result => {
            setTimeout(() => { this.pageLoader = false; }, 500);
            if(result.status) {
              this.notForm = result.data;
              if(this.notForm.notify_on) {
                this.notForm.notify_date = new Date(this.notForm.notify_on);
                this.notForm.notify_time = this.datepipe.transform(this.notForm.notify_date, 'hh:mm a');
              }
              if(this.notForm.end_on) {
                this.notForm.end_date = new Date(this.notForm.end_on);
                this.notForm.end_time = this.datepipe.transform(this.notForm.end_date, 'hh:mm a');
              }
            }
            else console.log("response", result);
          });
        }
    });
  }

  onSubmit() {
    this.notForm.submit = true;
    if(this.notForm.notify_date && this.notForm.notify_time) {
      this.notForm.notify_on = new Date(this.datepipe.transform(new Date(this.notForm.notify_date), 'dd MMM y')+' '+this.notForm.notify_time);
    }
    if(this.notForm.end_status && this.notForm.end_date && this.notForm.end_time) {
      this.notForm.end_on = new Date(this.datepipe.transform(new Date(this.notForm.end_date), 'dd MMM y')+' '+this.notForm.end_time);
    }
    if(this.params.id) {
      this.adminApi.UPDATE_NOTIFY(this.notForm).subscribe((result) => {
        delete this.notForm.submit;
        if(result.status) this.router.navigate(['/admin/notifications']);
        else {
          this.notForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.adminApi.ADD_NOTIFY(this.notForm).subscribe((result) => {
        delete this.notForm.submit;
        if(result.status) this.router.navigate(['/admin/notifications']);
        else {
          this.notForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(event, i) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.notForm.payload_list[i].image = (<FileReader>event.target).result;
        this.notForm.payload_list[i].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  changeType() {
    this.notForm.payload_list = [this.notForm.payload_list[0]];
  }

  timePicker(field) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.notForm[field] = this.commonService.timeConversion(time);
    });
  }

}