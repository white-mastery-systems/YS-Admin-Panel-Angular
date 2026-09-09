import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    standalone: false
})

export class MyProfileComponent implements OnInit {

  storeData: any = {};
  addressInfo: any; pwdForm: any = {}; deactiveForm: any = { reason: "" };
  state_list: any = []; discAmount: number;
  popupLoader: boolean;
  desktopDevice: boolean;
  account_deact: boolean;
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService,
    private api: StoreApiService, private deviceService: DeviceDetectorService, public cookieService: CookieService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    if(localStorage.getItem('accDeAct')) this.account_deact = true;
    else if(this.cookieService.check('accDeAct')) this.account_deact = true;
    this.commonService.redirect = "/account";
    if(this.commonService.previous_route && this.commonService.previous_route!='/') this.commonService.redirect = this.commonService.previous_route;
    this.commonService.secondary_header = "Profile";
    this.addressInfo = [];
    if(this.commonService.store_details?.company_details) {
      if(this.commonService.store_details?.company_details?.city) this.addressInfo.push(this.commonService.store_details.company_details.city);
      if(this.commonService.store_details?.company_details?.state) this.addressInfo.push(this.commonService.store_details.company_details.state);
      if(this.commonService.store_details?.company_details?.pincode) this.addressInfo.push(this.commonService.store_details.company_details.pincode);
      this.addressInfo.push(this.commonService.store_details.country);
    }
    if(this.deviceService.isDesktop()) this.desktopDevice = true;
    this.discAmount = (this.commonService.store_details?.package_info?.pricing['1']?.amount * 0.1);
  }

  onEdit(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.STORE_DETAILS().subscribe(result => {
      this.popupLoader = false;
      if(result.status) {
        this.storeData = result.data;
        this.storeData.category = this.commonService.deploy_details.category;
        this.onCountryChange(this.storeData.country);
      }
      else console.log("response", result);
    });
  }

  onUpdate(modalName) {
    let formData: any = { name: this.storeData.name, gst_no: this.storeData.gst_no, company_details: this.storeData.company_details };
    if(this.commonService.deploy_details.category == this.storeData.category) {
      this.onUpdateCont(formData);
    }
    else {
      if(this.storeData.change_category) {
        formData.category = this.storeData.category;
        formData.change_category = true;
        this.onUpdateCont(formData);
      }
      else this.modalService.open(modalName, { size: 'md', centered: true});
    }
  }
  onUpdateCont(formData) {
    this.storeData.submit = true;
    this.api.STORE_UPDATE(formData).subscribe(result => {
      this.storeData.submit = false;
      if(result.status) {
        this.commonService.store_details.name = result.data.name;
        this.commonService.store_details.gst_no = result.data.gst_no;
        this.commonService.store_details.company_details = result.data.company_details;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        if(result.deploy_details) {
          this.commonService.deploy_details = result.deploy_details;
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        }
        this.ngOnInit();
        document.getElementById('closeModal').click();
      }
      else {
				this.storeData.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePwd() {
    this.pwdForm.submit = true;
    this.api.CHANGE_PWD(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.signOut('/session/signin');
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  openDeactivate(modalName) {
    if(this.commonService.store_details?.package_info?.category=='pro' && this.commonService.store_details?.signup_by=='self' && !this.commonService.store_details?.package_details?.billing_status) {
      document.getElementById('openDiscModal').click();
    }
    else this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  deactivate_store() {
    this.deactiveForm.submit = true;
    let devType = "";
    if(this.desktopDevice) devType = "Desktop";
    else {
      if(this.commonService.ios) devType = "IOS";
      else devType = "Android";
    }
    this.deactiveForm.device_type = devType;
    this.api.DEACTIVATE_ENQUIRY(this.deactiveForm).subscribe(result => {
      this.deactiveForm.submit = false;
      if(result.status) {
        if(this.commonService.ios) {
          localStorage.setItem('accDeAct', 'true');
          this.account_deact = true;
        }
        this.cookieService.set('accDeAct', 'true', 2);
        document.getElementById('closeModal').click();
      }
      else {
				this.deactiveForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.state_list = this.commonService.country_list[index].states;
      if(!this.storeData.company_details.dial_code)
        this.storeData.company_details.dial_code = this.commonService.country_list[index].dial_code;
    }
  }

}