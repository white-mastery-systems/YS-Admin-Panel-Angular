import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss'],
    standalone: false
})

export class PoliciesComponent implements OnInit {

  params: any; pageLoader: boolean;
  editForm: any = {};
  menuList: any = [
    { name: "Privacy Policy", state: "/setup/policies/privacy" },
    { name: "Shipping Policy", state: "/setup/policies/shipping" },
    { name: "Cancellation Policy", state: "/setup/policies/cancellation" },
    { name: "Terms and Conditions", state: "/setup/policies/terms_conditions" }
  ];

  constructor(private activeRoute: ActivatedRoute, private router: Router, private api: SetupService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params; delete this.editForm;
      if(this.params.type) {
        this.pageLoader = true;
        let policyTitle = "PRIVACY POLICY";
        if(this.params.type=='shipping') policyTitle = "SHIPPING POLICY";
        else if(this.params.type=='cancellation') policyTitle = "CANCELLATION POLICY";
        else if(this.params.type=='terms_conditions') policyTitle = "TERMS AND CONDITIONS";
        this.commonService.secondary_header = policyTitle;
        this.commonService.redirect = '/setup/policies';
        this.api.POLICY_DETAILS(this.params.type).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) this.editForm = result.data;
          else this.editForm = { type: this.params.type, title: policyTitle };
        });
      }
      else {
        this.commonService.secondary_header = "Policies";
        this.commonService.redirect = "/setup";
        if(sessionStorage.getItem("rfd")) this.commonService.redirect = "/dashboard";
      }
    });
  }

  onUpdate() {
    this.api.UPDATE_POLICY(this.editForm).subscribe(result => {
      if(result.status) 
      {
        if(this.commonService.desktop_device) this.router.navigate(['/setup/policies']);
        else this.router.navigate(['/setup']);        
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}