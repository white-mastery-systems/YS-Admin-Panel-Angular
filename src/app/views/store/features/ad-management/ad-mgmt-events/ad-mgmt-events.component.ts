import { Component, OnInit } from '@angular/core';
import { StoreApiService } from 'src/app/services/store-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-ad-mgmt-events',
  templateUrl: './ad-mgmt-events.component.html',
  styleUrls: ['./ad-mgmt-events.component.scss']
})

export class AdMgmtEventsComponent implements OnInit {

  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  adForm: any = {}; segmentList: any = [];

  constructor(config: NgbModalConfig, public modalService: NgbModal, public api: StoreApiService, public commonService: CommonService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/features/ad-management";
      this.commonService.secondary_header = "Add Segment";
      this.adForm = { form_type: 'add', disable_dates: [] };
      if(params.id != 'add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Segment";
        this.api.LAYOUT_DETAILS(params.id, false).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            let segmentData = result.data;
            this.adForm = { _id: segmentData._id, layout_name: segmentData.name, form_type: 'edit', disable_dates: [] };
            if(!segmentData.ad_config) { segmentData.ad_config = {}; }
            for(let key in segmentData.ad_config) {
              if(segmentData.ad_config.hasOwnProperty(key)) this.adForm[key] = segmentData.ad_config[key];
            }
            if(this.adForm.disable_dates.length) {
              this.adForm.schedule_status = true;
              this.adForm.disable_dates.forEach(el => {
                el.from = new Date(el.from);
                el.to = new Date(el.to);
              });
            }
          }
          else console.log("response", result);
        });
      }
      else if(sessionStorage.getItem("sList")) {
        this.segmentList = JSON.parse(sessionStorage.getItem("sList"));
      }
      else this.router.navigate(["/features/ad-management"]);
    });    
  }

  onSubmit() {
    this.adForm.submit = true;
    if(this.adForm.form_type=='add') {
      this.api.ADD_AD(this.adForm).subscribe((result) => {
        this.adForm.submit = false;
        if(result.status) this.router.navigate(["/features/ad-management"]);
        else {
          this.adForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_AD(this.adForm).subscribe((result) => {
        this.adForm.submit = false;
        if(result.status) this.router.navigate(["/features/ad-management"]);
        else {
          this.adForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
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

  ngOnDestroy() {
    sessionStorage.removeItem("sList");
  }

}