import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../../account/account.service';
import { CommonService } from '../../../../../services/common.service';
import { DeploymentService } from '../../../deployment/deployment.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-vendor-events',
    templateUrl: './vendor-events.component.html',
    styleUrls: ['./vendor-events.component.scss'],
    standalone: false
})

export class VendorEventsComponent implements OnInit {

  pageLoader: boolean; vendorForm: any = {};
  imgBaseUrl = environment.img_baseurl;
  pstate_list: any = []; rstate_list: any = [];
  reg_address_fields: any = [];
  pick_address_fields: any = [];
  shippingPriceConfig: any = { price: 100, free_above: 499 };
  configData: any= environment.config_data;

  constructor(
    private api: AccountService, public commonService: CommonService, private activeRoute: ActivatedRoute,
    private router: Router, private deployApi: DeploymentService
  ) {
    if(this.commonService.store_details.additional_features?.shipping_price_config) {
      this.shippingPriceConfig = this.commonService.store_details.additional_features?.shipping_price_config;
    }
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/vendors/list";
      this.commonService.secondary_header = "";
      // edit
      if(params.vendor_id) {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Vendor";
        this.api.VENDOR_DETAILS(params.vendor_id).subscribe(result => {
          this.pageLoader = false;
          if(result.status) {
            this.vendorForm = result.data;
            delete this.vendorForm.password;
            this.onRCountryChange(this.vendorForm.registered_address?.country);
            this.onPCountryChange(this.vendorForm.pickup_address?.country);
            this.vendorForm.form_type = 'edit';
            this.commonService.secondary_header += " - "+this.vendorForm.email;
            this.reg_address_fields.forEach(element => {
              element.value = this.vendorForm.registered_address[element.keyword];
            });
            this.pick_address_fields.forEach(element => {
              element.value = this.vendorForm.pickup_address[element.keyword];
            });
            if(this.vendorForm.company_details?.established_on)
              this.vendorForm.company_details.established_on = new Date(this.vendorForm.company_details.established_on);
            // seo
            if(!this.vendorForm.seo_details) this.vendorForm.seo_details = {};
            this.vendorForm.seo_details.meta_keyword_list = [];
            if(this.vendorForm.seo_details.meta_keywords?.length) {
              this.vendorForm.seo_details.meta_keywords.forEach(obj => {
                this.vendorForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
          }
          else console.log("response", result);
        });
      }
      else {
        this.onRCountryChange(this.commonService.store_details?.country);
        this.onPCountryChange(this.commonService.store_details?.country);
        this.commonService.secondary_header = "Add Vendor";
        this.vendorForm = {
          form_type: 'add', password: this.generatePwd(), company_details: { made_in_home_country: '', shipping_type: '' },
          registered_address: { country: this.commonService.store_details?.country },
          pickup_address: { country: this.commonService.store_details?.country }, bank_details: { currency: this.commonService.store_currency?.country_code }, seo_details: {},
          cmsn_config: { pgw_charges: 0, settlem_in_days: 7 }, price_range: [], cmsn_type: "flat", cmsn_in_pct: 0
        };
      }
    });
  }

  onSubmit() {
    delete this.vendorForm.errorMsg; delete this.vendorForm.disableSubmit;
    this.vendorForm.seo_details.meta_keywords = [];
    if(this.vendorForm.seo_details?.meta_keyword_list) {
      this.vendorForm.seo_details.meta_keyword_list.forEach(obj => {
        this.vendorForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    this.reg_address_fields.forEach(element => {
      if(element.value) this.vendorForm.registered_address[element.keyword] = element.value;
    });
    this.pick_address_fields.forEach(element => {
      if(element.value) this.vendorForm.pickup_address[element.keyword] = element.value;
    });
    if(this.vendorForm.cmsn_type=='flat') this.vendorForm.price_range = [];
    this.vendorForm.submit = true;
    if(this.vendorForm.form_type=='add') {
      this.vendorForm.status = "active";
      this.api.ADD_VENDOR(this.vendorForm).subscribe((result) => {
        this.vendorForm.submit = false;
        if(result.status) {
          if(result.message) {
            this.vendorForm.errorMsg = result.message;
            this.vendorForm.disableSubmit = true;
            console.log("response", result);
          }
          else {
            this.updateDeployStatus();
            this.router.navigate([this.commonService.redirect]);
          }
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_VENDOR(this.vendorForm).subscribe(result => {
        this.vendorForm.submit = false;
        if(result.status) {
          this.updateDeployStatus();
          this.router.navigate([this.commonService.redirect]);
        }
        else {
          this.vendorForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onPCountryChange(x) {
    this.pstate_list = [];
    this.pick_address_fields = [];
    let cDetails = this.commonService.country_list.find(object => object.name==x);
    if(cDetails) {
      this.pstate_list = cDetails.states;
      cDetails.address_fields.forEach(el => {
        this.pick_address_fields.push({ keyword: el.keyword, label: el.label });
      });
    }
  }
  onRCountryChange(x) {
    this.rstate_list = [];
    this.reg_address_fields = [];
    let cDetails = this.commonService.country_list.find(object => object.name==x);
    if(cDetails) {
      this.rstate_list = cDetails.states;
      cDetails.address_fields.forEach(el => {
        this.reg_address_fields.push({ keyword: el.keyword, label: el.label });
      });
    }
  }

  generatePwd() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(let i = 0; i < 8; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  onChangeTitle() {
    if(this.vendorForm.form_type=='add') {
      this.vendorForm.seo_details.page_url = this.commonService.urlFormat(this.vendorForm.company_details.brand);
      let tempName = this.vendorForm.company_details.brand.substring(0, 70);
      this.vendorForm.seo_details.h1_tag = tempName;
      this.vendorForm.seo_details.page_title = tempName;
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.vendorForm.image = (<FileReader>event.target).result;
        this.vendorForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['vendors']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.vendors": new Date() };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

}