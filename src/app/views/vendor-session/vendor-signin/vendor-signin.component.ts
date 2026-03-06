import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-vendor-signin',
  templateUrl: './vendor-signin.component.html',
  styleUrls: ['./vendor-signin.component.scss'],
  animations: [SharedAnimations]
})

export class VendorSigninComponent implements OnInit {

  loading: boolean;
  loginForm: any = {};

  constructor(
    public commonService: CommonService, public router: Router, private api: ApiService,
    private sidebar: SidebarService, private storeApi: StoreApiService
  ) { }

  ngOnInit(): void {
  }

  signin() {
    this.loading = true;
    this.loginForm.store_id = this.commonService.vendor_login_info?.id;
    if(this.router.url.indexOf('branch')!=-1) {
      this.api.BRANCH_LOGIN(this.loginForm).subscribe(result => {
        this.loading = false;
        if(result.status) {
          localStorage.setItem("store_token", result.token);
          this.commonService.store_details = {
            type: result.data.type,
            sub_type: result.data.sub_type,
            login_email: this.loginForm.email,
            login_type: result.login_type,
            _id: result.data._id,
            login_id: result.data.login_id,
            name: result.data.name,
            email: result.data.email,
            gst_no: result.data.gst_no,
            website: result.data.website,
            base_url: result.data.base_url,
            sub_domain: result.data.sub_domain,
            wallet: result.data.wallet,
            currency_types: result.data.currency_types,
            country: result.data.country,
            created_on: result.data.created_on,
            additional_features: result.data.additional_features,
            company_details: result.data.company_details,
            package_details: result.data.package_details,
            package_info: result.data.package_info,
            signup_by: result.data.signup_by,
            status: result.data.status
          };
          let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
          this.commonService.store_currency = result.data.currency_types[currencyIndex];
          this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
          this.commonService.updateLocalData('store_details', this.commonService.store_details);
          // vendor details
          this.commonService.vendor_details = result.vendor_details;
          this.commonService.updateLocalData('vendor_details', this.commonService.vendor_details);
          // vendor features
          this.commonService.vendor_features = ['update_product_stock_only'];
          this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
          // payment list
          // this.commonService.payment_list = result.data.payment_types;
          // this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
          // // deploy stages
          // this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
          // this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
          // deploy details
          this.commonService.deploy_details = result.data.deployDetails[0];
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          // ys features
          if(!result.ys_features) result.ys_features = [];
          this.commonService.ys_features = result.ys_features;
          // trial features
          let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
          if(trialFeatures.length) {
            trialFeatures.forEach(obj => {
              let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
              if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                this.commonService.ys_features.push(obj.name);
              }
            });
          }
          this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
          this.sidebar.BUILD_CATEGORY_LIST();
          this.router.navigateByUrl('/branch-dashboard');
        }
        else {
          this.loginForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.VENDOR_LOGIN(this.loginForm).subscribe(result => {
        this.loading = false;
        if(result.status) {
          localStorage.setItem("store_token", result.token);
          this.commonService.store_details = {
            type: result.data.type,
            sub_type: result.data.sub_type,
            login_email: this.loginForm.email,
            login_type: result.login_type,
            _id: result.data._id,
            login_id: result.data.login_id,
            name: result.data.name,
            email: result.data.email,
            gst_no: result.data.gst_no,
            website: result.data.website,
            base_url: result.data.base_url,
            sub_domain: result.data.sub_domain,
            wallet: result.data.wallet,
            currency_types: result.data.currency_types,
            country: result.data.country,
            created_on: result.data.created_on,
            additional_features: result.data.additional_features,
            company_details: result.data.company_details,
            package_details: result.data.package_details,
            package_info: result.data.package_info,
            signup_by: result.data.signup_by,
            status: result.data.status
          };
          if(result.data.vendor_commission) this.commonService.store_details.vendor_commission = result.data.vendor_commission;
          if(result.data.payout_gateway) this.commonService.store_details.payout_gateway = result.data.payout_gateway;
          if(result.data.wati_config) this.commonService.store_details.wati_config = result.data.wati_config;
          if(new Date("2023-01-01") < new Date(result.data.created_on)) this.commonService.store_details.enable_reset = true;
          let currencyIndex = result.data.currency_types.findIndex(obj => obj.default_currency);
          this.commonService.store_currency = result.data.currency_types[currencyIndex];
          this.commonService.updateLocalData('store_currency', this.commonService.store_currency);
          this.commonService.updateLocalData('store_details', this.commonService.store_details);
          // vendor details
          this.commonService.vendor_details = result.vendor_details;
          this.commonService.updateLocalData('vendor_details', this.commonService.vendor_details);
          // vendor features
          this.commonService.vendor_features = result.vendor_details.permission_list;
          this.commonService.updateLocalData('vendor_features', this.commonService.vendor_features);
          // payment list
          this.commonService.payment_list = result.data.payment_types;
          this.commonService.updateLocalData('payment_list', this.commonService.payment_list);
          // deploy stages
          this.commonService.deploy_stages = result.data.deployDetails[0].deploy_stages;
          this.commonService.updateLocalData('deploy_stages', this.commonService.deploy_stages);
          // deploy details
          this.commonService.deploy_details = result.data.deployDetails[0];
          delete this.commonService.deploy_details.deploy_stages;
          this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
          if(this.commonService.vendor_details.status=='active') {
            // ys features
            if(!result.ys_features) result.ys_features = [];
            this.commonService.ys_features = result.ys_features;
            // trial features
            let trialFeatures = this.commonService.deploy_details.trial_features.filter(obj => !obj.uninstalled && obj.status=='active');
            if(trialFeatures.length) {
              trialFeatures.forEach(obj => {
                let expiryDate = new Date(new Date(obj.create_on).setDate(new Date(obj.create_on).getDate() + 14)).setHours(23,59,59,999);
                if(new Date(expiryDate) >= new Date() && this.commonService.ys_features.indexOf(obj.name)==-1) {
                  this.commonService.ys_features.push(obj.name);
                }
              });
            }
            this.commonService.updateLocalData('ys_features', this.commonService.ys_features);
            // store features
            this.storeApi.STORE_FEATURES().subscribe(result => {
              if(result.status) {
                this.commonService.courier_partners = result.data.courier_partners.filter(obj => obj.status=='active');
                this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
              }
            });
            this.sidebar.BUILD_CATEGORY_LIST();
            this.router.navigateByUrl('/vendor-dashboard');
          }
          else if(this.commonService.vendor_details.status=='expired') {
            this.commonService.route_permission_list = ["vendor_billing"];
            this.commonService.updateLocalData('route_permission_list', this.commonService.route_permission_list);
            this.router.navigateByUrl('/vendor-account/vendor-billing');
          }
          else this.loginForm.errorMsg = "Account Deactivated.";
        }
        else {
          this.loginForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}