import { Component, OnInit } from '@angular/core';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';
declare var $;

@Component({
    selector: 'app-deploy-domain',
    templateUrl: './deploy-domain.component.html',
    styleUrls: ['./deploy-domain.component.scss'],
    standalone: false
})

export class DeployDomainComponent implements OnInit {

  domainForm: any;
  providerList: any = [
    { name: "GoDaddy" },
    { name: "Namecheap" },
    { name: "Hostgator" },
    { name: "Cloudflare" },
    { name: "Big Rock" },
    { name: "ResellerClub" },
    { name: "Bluehost" },
    { name: "Domain.com" },
    { name: "Google Domains" },
    { name: "Enom" },
    { name: "Others" }
  ];
  configData: any = environment.config_data;
  validate_conn: boolean; vRequested: boolean;

  constructor(public commonService: CommonService, private storeApi: StoreApiService) { }

  ngOnInit(): void {
    this.commonService.redirect = "/setting";
    if(this.commonService.previous_route && this.commonService.previous_route!='/') this.commonService.redirect = this.commonService.previous_route;
    this.commonService.secondary_header = "Domain";
    this.domainForm = { provider: '', form_type: 'buy_domain' };
    if(localStorage.getItem("connect_domain")) this.domainForm = JSON.parse(localStorage.getItem("connect_domain"));
    if(this.commonService.store_details?.package_details?.package_id==this.configData.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
  }

  ngAfterViewInit() {
    // chat
    if(environment.enable_chat && this.commonService.store_details?.login_type!='vendor') {
      this.commonService.dispChatIcon = true;
    }
  }

  onSubmit() {
    if(this.commonService.dispChatIcon) {
      let msgContent = "";
      if(this.domainForm.form_type == "buy_domain") {
        msgContent = "Hi,\nI would like to buy this domain "+this.domainForm.domain+" for my store "+this.commonService.store_details?.name+".";
      }
      else if(this.domainForm.form_type == "connect_domain") {
        let provider = this.domainForm.provider;
        if(provider=='Others') provider = this.domainForm.other_provider;
        msgContent = "Hi,\nI would like to have my domain "+this.domainForm.domain+" bought on "+provider+" linked to my store "+this.commonService.store_details?.name+".";
      }
      if(document.getElementById("openChat")) {
        document.getElementById("openChat").click();
        setTimeout(() => {
          $("textarea#msgarea").val(msgContent);
          $("textarea#msgarea").focus();
        }, 100);
      }
    }
    else {
      if(!this.domainForm.success) {
        this.domainForm.submit = true;
        let formData = { form_type: this.domainForm.form_type, provider: this.domainForm.provider, domain: this.domainForm.domain };
        if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
        if(formData.form_type == "buy_domain") delete formData.provider;
        this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
          delete this.domainForm.submit;
          this.domainForm.success = true;
          localStorage.setItem("connect_domain", JSON.stringify(this.domainForm));
          if(formData.form_type=="connect_domain") this.validate_conn = true;
          if(!result.status) console.log("response", result);
        });
      }
    }
  }

  validateConn() {
    if(!this.vRequested) {
      this.domainForm.submit = true;
      let formData = { form_type: "validate_connect_domain", provider: this.domainForm.provider, domain: this.domainForm.domain };
      if(this.domainForm.provider=='Others') formData.provider = this.domainForm.other_provider;
      this.storeApi.DOMAIN_ENQUIRY(formData).subscribe(result => {
        delete this.domainForm.submit;
        this.vRequested = true;
        if(!result.status) console.log("response", result);
      });
    }
  }

}