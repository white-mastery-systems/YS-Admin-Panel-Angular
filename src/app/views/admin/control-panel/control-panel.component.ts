import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ApiService } from '../../../services/api.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { StoreApiService } from '../../../services/store-api.service';
import { AccountService } from '../../store/account/account.service';
import { ShippingService } from '../../store/shipping/shipping.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonService } from '../../../services/common.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  animations: [SharedAnimations]
})

export class ControlPanelComponent implements OnInit {

  loading: boolean; loadingText: string;
  store_id: any; errorMsg: any;

  constructor(
    public router: Router, private adminApi: AdminApiService, private storeApi: StoreApiService, private sidebar: SidebarService, private io: SocketService,
    public commonService: CommonService, private api: ApiService, private accApi: AccountService, private shipService: ShippingService
  ) { }

  ngOnInit() {
    this.loading = false; this.loadingText = "";
    if(this.commonService.store_details._id) this.store_id = this.commonService.store_details._id;
    if(!this.commonService.store_list.length) {
      this.adminApi.STORE_LIST("type=active").subscribe(result => {
        if(result.status) this.commonService.store_list = result.list;
        else console.log("response", result);
      });
    }
  }

  storePanel() {
    if(this.store_id) {
      this.loading = true; this.loadingText = 'Loading...';
      this.adminApi.GENERATE_STORE_TOKEN({ store_id: this.store_id }).subscribe(result => {
        this.loading = false; this.loadingText = "";
        if(result.status) {
          let masterToken = localStorage.getItem("master_token");
          this.commonService.clearData();
          this.commonService.master_token = masterToken;
          this.commonService.store_token = result.token;
          localStorage.setItem("master_token", this.commonService.master_token);
          localStorage.setItem("store_token", this.commonService.store_token);
          this.commonService.store_details = {
            type: result.data.type,
            sub_type: result.data.sub_type,
            login_email: result.data.email,
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
          // socket
          this.io.onCreateRoom({ store_id: this.commonService.store_details.login_id });
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
          // ys features
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
          // shipping methods
          this.commonService.shipping_list = [];
          this.shipService.SHIPPING_LIST().subscribe(result => {
            if(result.status) this.commonService.shipping_list = result.list.filter(obj => obj.status=='active');
            this.commonService.updateLocalData('shipping_list', this.commonService.shipping_list);
          });
          // vendor list
          this.commonService.vendor_list = [];
          if(this.commonService.ys_features.indexOf('vendors')!=-1) {
            this.accApi.VENDOR_LIST().subscribe(result => {
              if(result.status) this.commonService.vendor_list = result.list.filter(el => el.status=='active');
              this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
            });
          }
          else this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
          // branch list
          this.commonService.store_branch_list = [];
          if(this.commonService.ys_features.indexOf('branch_stock')!=-1) {
            this.accApi.STORE_BRANCH_LIST().subscribe(result => {
              if(result.status) this.commonService.store_branch_list = result.list.map(item => ({ _id: item._id, name: item.name }));
              this.commonService.updateLocalData('store_branch_list', this.commonService.store_branch_list);
            });
          }
          else this.commonService.updateLocalData('store_branch_list', this.commonService.store_branch_list);
          // store features
          this.commonService.user_list = []; this.commonService.courier_partners = [];
          this.commonService.updateLocalData('user_list', this.commonService.user_list);
          this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
          this.storeApi.STORE_FEATURES().subscribe(result => {
            if(result.status) {
              result.data.sub_users.filter(obj => obj.status=='active').forEach(obj => {
                this.commonService.user_list.push({ _id: obj._id, name: obj.name });
              });
              this.commonService.courier_partners = result.data.courier_partners.filter(obj => obj.status=='active');
              this.commonService.updateLocalData('user_list', this.commonService.user_list);
              this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
            }
          });
          this.sidebar.BUILD_CATEGORY_LIST();
          this.router.navigateByUrl('/dashboard');
        }
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  clientHub() {
    // live currency
    this.adminApi.YS_CURRENCY_LIST().subscribe(result => {
      this.commonService.currency_types = [];
      if(result.status) {
        let bInd = result.list.findIndex(el => el.name=='INR');
        if(bInd!=-1) {
          let el = result.list[bInd];
          this.commonService.currency_types.push({
            base: el.name, country_code: el.name, html_code: el.html_code, store_base: el.store_base
          });
        }
        result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1)).forEach(el => {
          if(el.name != 'INR') {
            this.commonService.currency_types.push({
              base: el.name, country_code: el.name, html_code: el.html_code, store_base: el.store_base
            });
          }
        });
        // EUR Rates
        let eInd = result.list.findIndex(el => el.name=='EUR');
        if(eInd!=-1) {
          this.commonService.updateLocalData('euro_rates', result.list[eInd].rates);
        }
      }
      this.commonService.updateLocalData('currency_types', this.commonService.currency_types);
    });
    // country list
    if(!localStorage.getItem("country_list")) {
      this.api.COUNTRIES_LIST().subscribe(result => {
        this.commonService.country_list = [];
        if(result.status) this.commonService.country_list = result.list;
        this.commonService.updateLocalData('country_list', this.commonService.country_list);
      });
    }
    // packages
    this.adminApi.PACKAGE_LIST().subscribe(result => {
      this.commonService.admin_packages = [];
      if(result.status) this.commonService.admin_packages = result.list;
      this.commonService.updateLocalData('admin_packages', this.commonService.admin_packages);
    });
    // features
    this.adminApi.FEATURE_LIST().subscribe(result => {
      this.commonService.admin_features = [];
      if(result.status) this.commonService.admin_features = result.list;
      this.commonService.updateLocalData('admin_features', this.commonService.admin_features);
    });
    this.router.navigate(['/admin/dashboard']);
  }

}