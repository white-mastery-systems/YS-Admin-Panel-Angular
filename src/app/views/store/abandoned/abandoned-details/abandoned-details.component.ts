import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-abandoned-details',
  templateUrl: './abandoned-details.component.html',
  styleUrls: ['./abandoned-details.component.scss'],
  animations: [SharedAnimations]
})

export class AbandonedDetailsComponent implements OnInit {

  customer_details: any = {};
  pageLoader: boolean;
  imgBaseUrl = environment.img_baseurl;
  cartTotal: number = 0;

  constructor(
    private activeRoute: ActivatedRoute, private customerApi: CustomerApiService,
    public router: Router, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.commonService.secondary_header = "Quote Items";
      if(this.router.url.includes('cart')) this.commonService.secondary_header = "Cart Items";
      if(this.router.url.indexOf('guest')!=-1) {
        this.commonService.redirect = "/orders/abandoned-cart/guest-user";
        this.customerApi.GUEST_USER_DETAILS(params.customer_id).subscribe(result => {
          if(result.status) {
            this.customer_details = result.data;
            this.cartTotal = this.customer_details.cart_list.reduce((accumulator, currentValue) => {
              return accumulator + (currentValue['final_price'] * currentValue['quantity']);
            }, 0);
            this.customer_details.name = "NA";
            this.customer_details.mobile = "NA";
            if(this.customer_details.address_list.length) {
              let addrData = this.customer_details.address_list[0];
              this.customer_details.name = addrData.name;
              this.customer_details.mobile = addrData.mobile;
              if(this.customer_details.mobile.charAt(0) === '0') this.customer_details.mobile = this.customer_details.mobile.substring(1);
              if(addrData.dial_code) this.customer_details.mobile = addrData.dial_code+" "+this.customer_details.mobile;
            }
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      else {
        this.commonService.redirect = "/orders/abandoned-cart/customer";
        this.customerApi.CUSTOMER_DETAILS(params.customer_id).subscribe(result => {
          if(result.status) {
            this.customer_details = result.data;
            this.cartTotal = this.customer_details.cart_list.reduce((accumulator, currentValue) => {
              return accumulator + (currentValue['final_price'] * currentValue['quantity']);
            }, 0);
            if(this.customer_details.mobile) {
              if(this.customer_details.mobile.charAt(0) === '0') this.customer_details.mobile = this.customer_details.mobile.substring(1);
              if(this.customer_details.dial_code) this.customer_details.mobile = this.customer_details.dial_code+" "+this.customer_details.mobile;
            }
            else this.customer_details.mobile = "NA";
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }

}