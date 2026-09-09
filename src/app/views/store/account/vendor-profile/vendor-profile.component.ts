import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-vendor-profile',
    templateUrl: './vendor-profile.component.html',
    styleUrls: ['./vendor-profile.component.scss'],
    standalone: false
})

export class VendorProfileComponent implements OnInit {

  pageLoader: boolean; popupLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  pwdForm: any = {}; vendorDetails: any = {};
  imgForm: any = {}; vendorForm: any = {};
  state_list: any = [];
  reg_address_fields: any = [];
  pick_address_fields: any = [];
  seoForm: any = {};
  fileLimitInKB: number = 5000;
  fileList: FormData;
  fileDetails: any = {};
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService, private accountApi: AccountService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.accountApi.VENDOR_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) {
        this.vendorDetails = result.data;
        this.onCountryChange(this.commonService.store_details?.country);
      }
      else console.log("response", result);
    });
  }

  onEdit(modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'lg', windowClass: 'scroll-modal-xl', scrollable : true});
    this.accountApi.VENDOR_DETAILS(this.vendorDetails._id).subscribe((result) => {
      this.popupLoader = false;
      if(result.status) {
        this.vendorForm = result.data;
        delete this.vendorForm.password;
        this.reg_address_fields.forEach(element => {
          element.value = this.vendorForm.registered_address[element.keyword];
        });
        this.pick_address_fields.forEach(element => {
          element.value = this.vendorForm.pickup_address[element.keyword];
        });
      }
      else console.log("response", result);
    });
  }
  onUpdate() {
    this.fileList = new FormData();
    this.reg_address_fields.forEach(element => {
      if(element.value) this.vendorForm.registered_address[element.keyword] = element.value;
    });
    this.pick_address_fields.forEach(element => {
      if(element.value) this.vendorForm.pickup_address[element.keyword] = element.value;
    });
    this.vendorForm.submit = true;
    this.onSetFormData().then((dList) => {
      this.vendorForm.file_list = dList;
      this.fileList.append('data', JSON.stringify(this.vendorForm));
      this.accountApi.UPDATE_VENDOR_WITH_DOC(this.fileList).subscribe((result) => {
        this.vendorForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.vendorDetails = result.data;
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    });
  }

  onSetFormData() {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      let fList = ['input_file_1', 'input_file_2', 'input_file_3'];
      for(let x of fList) {
        let imgData = this.fileDetails[x];
        if(imgData) {
          this.fileList.append('attachments', imgData.file);
          updatedList.push({ name: imgData.name });
        }
      }
      resolve(updatedList);
    });
  }

  fileChangeListenerDoc(event, fileName, elemName) {
    if(event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size / 1024);
      if(fileInKB <= this.fileLimitInKB && ['image/jpeg', 'image/png', 'application/pdf'].indexOf(fileData.type) != -1) {
        this.fileDetails[elemName] = { file: fileData, name: fileName, temp_name: fileData.name };
      } else {
        let el: any = document.getElementById(elemName);
        if(el) el.value = '';
      }
    }
  }

  onEditSeo(x, modalName) {
    this.seoForm = { meta_keyword_list: [] };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.seoForm[key] = x[key];
    }
    if(this.seoForm.meta_keywords.length) {
      this.seoForm.meta_keywords.forEach(obj => {
        this.seoForm.meta_keyword_list.push({display: obj, value: obj});
      });
    }
    this.modalService.open(modalName, {scrollable : true});
  }
  onUpdateSeo() {
    this.seoForm.submit = true;
    this.seoForm.meta_keywords = [];
    if(this.seoForm.meta_keyword_list) {
      this.seoForm.meta_keyword_list.forEach(obj => {
        this.seoForm.meta_keywords.push(obj.value);
      });
    }
    this.accountApi.UPDATE_VENDOR({ seo_details: this.seoForm }).subscribe(result => {
      this.seoForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.vendorDetails = result.data;
      }
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateBanner() {
    this.imgForm.submit = true;
    this.accountApi.UPDATE_VENDOR(this.imgForm).subscribe(result => {
      this.imgForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.vendorDetails = result.data;
      }
      else {
        this.imgForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangePwd() {
    this.pwdForm.submit = true;
    this.accountApi.CHANGE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      this.pwdForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.signOut('/vendor/signin/'+this.commonService.vendor_login_info?.name);
      }
      else {
				this.pwdForm.errorMsg = result.message;
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
        this.imgForm.image = (<FileReader>event.target).result;
        this.imgForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  onCountryChange(x) {
    this.state_list = [];
    this.reg_address_fields = []; this.pick_address_fields = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      let cDetails = this.commonService.country_list[index];
      this.state_list = cDetails.states;
      cDetails.address_fields.forEach(el => {
        this.reg_address_fields.push({ keyword: el.keyword, label: el.label });
        this.pick_address_fields.push({ keyword: el.keyword, label: el.label });
      });
    }
  }

}