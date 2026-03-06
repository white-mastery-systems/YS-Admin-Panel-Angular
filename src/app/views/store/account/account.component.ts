import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { StoreApiService } from '../../../services/store-api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {

  pageLoader: boolean;
  
  constructor(private router: Router, public commonService: CommonService, public modalService: NgbModal, private cookieService: CookieService, private api: StoreApiService) { }
  
  ngOnInit(): void {
    this.commonService.redirect = "/account/billing";
    if(this.commonService.store_details?.status=='active') this.commonService.redirect = "/dashboard";
    this.commonService.secondary_header = "My Account";
    if(this.commonService.store_details?.login_type=='vendor') this.commonService.redirect = "/vendor-dashboard";
    this.pageLoader = true;
    setTimeout(() => { this.pageLoader = false; }, 100);
  }

  signOut() {
    if(this.commonService.master_token) {
      this.router.navigate(['/control-panel']);
    }
    else {
      if(this.commonService.store_details?.login_type=='vendor') {
        this.commonService.signOut('/vendor/signin/'+this.commonService.store_details?.sub_domain);
      }
      else if(this.commonService.store_details?.login_type=='branch') {
        this.commonService.signOut('/branch/signin/'+this.commonService.store_details?.sub_domain);
      }
      else {
        if(this.cookieService.check('app_token') || localStorage.getItem('app_token')) {
          let appToken = localStorage.getItem('app_token');
          if(this.cookieService.check('app_token')) appToken = this.cookieService.get('app_token');
          this.api.LOGOUT({ token: appToken }).subscribe(result => {
            if(result.status) {
              this.commonService.signOut('/session/signin');
            }
            else console.log("response", result);
          });
        }
        else this.commonService.signOut('/session/signin');
      }
    }
  }

}