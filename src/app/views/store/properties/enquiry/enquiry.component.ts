import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-enquiry',
    templateUrl: './enquiry.component.html',
    styleUrls: ['./enquiry.component.scss'],
    standalone: false
})

export class EnquiryComponent implements OnInit {

  params: any;
  submit: boolean;
  success_msg: boolean;

  constructor(private api: ApiService, private activeRoute: ActivatedRoute, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
        this.commonService.redirect = "/dashboard";
        this.commonService.secondary_header = "Enquiry";
          this.params = params;
          let lsType = this.params.type+'-enq';
          if(localStorage.getItem(lsType)) this.success_msg = true;
          if(this.params.type==='professional-setup') this.commonService.secondary_header = "Professional Setup";
          else if(this.params.type==='android-app') this.commonService.secondary_header = "Android App";
          else this.commonService.secondary_header = "Marketing Automation";
    });
  }

  onSubmit() {
    if(!this.success_msg) {
      let formData = {
        name: this.commonService.store_details.company_details?.name, email: this.commonService.store_details.email,
        mobile: this.commonService.store_details.company_details?.dial_code+' '+this.commonService.store_details.company_details?.mobile,
        store_name: this.commonService.store_details.name, enquiry_type: this.params.type, message: "NA",
        form_type: "YS Dashboard - Professional Setup", mail_subject: "Professional Setup Enquiry"
      };
      if(this.params.type==='android-app') {
        formData.mail_subject = "Android App Enquiry";
        formData.form_type = "YS Dashboard - Android App Enquiry";
      }
      else if(this.params.type==='marketing-automation')
      {
        formData.mail_subject = "Marketing Automation Enquiry";
        formData.form_type = "YS Dashboard - Marketing Automation Enquiry";
      }
      this.submit = true;
      this.api.ENQUIRY(formData).subscribe(result => {
        let lsType = this.params.type+'-enq';
        localStorage.setItem(lsType, "true");
        this.submit = false;
        this.success_msg = true;
      });
    }
  }

}