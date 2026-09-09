import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { SidebarService } from '../../../../services/sidebar.service';
import { DeploymentService } from '../../deployment/deployment.service';

@Component({
    selector: 'app-store-config',
    templateUrl: './store-config.component.html',
    styleUrls: ['./store-config.component.scss'],
    standalone: false
})

export class StoreConfigComponent implements OnInit {

  pageLoader: boolean;
  app_setting: any = {};

  constructor(
    public commonService: CommonService, private api: StoreApiService,
    private sbService: SidebarService, private deployApi: DeploymentService
  ) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.commonService.redirect = "/setting";
		this.commonService.secondary_header = "B2B Configuration";
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        this.app_setting.sub_type = result.data.sub_type;
        this.commonService.store_details.sub_type = result.data.sub_type;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
        this.api.STORE_PROPERTY_DETAILS().subscribe((result) => {
          this.pageLoader = false;
          if(result.status) this.app_setting.hide_amount = result.data.application_setting.hide_amount;
          else console.log("response", result);
        });
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.app_setting.submit = true;
    if(this.commonService.store_details?.type=='quot_based' && this.app_setting.sub_type!='enquiry') {
      this.app_setting.hide_amount = false;
    }
    this.api.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.hide_amount": this.app_setting.hide_amount }).subscribe(result => {
      if(result.status) {
        this.api.STORE_UPDATE({ sub_type: this.app_setting.sub_type }).subscribe(result => {
          this.app_setting.submit = false;
          if(result.status) {
            this.updateDeployStatus();
            this.commonService.store_details.sub_type = result.data.sub_type;
            this.commonService.updateLocalData('store_details', this.commonService.store_details);
            this.sbService.getSidePanelList();
            this.ngOnInit();
          }
          else {
            this.app_setting.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else {
        this.app_setting.submit = false;
        this.app_setting.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['config']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.config": new Date() };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

}