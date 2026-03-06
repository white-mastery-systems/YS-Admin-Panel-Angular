import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { CustomerApiService } from '../../../../../services/customer-api.service';

@Component({
  selector: 'app-guest-user-details',
  templateUrl: './guest-user-details.component.html',
  styleUrls: ['./guest-user-details.component.scss']
})

export class GuestUserDetailsComponent implements OnInit {

  pageLoader: boolean;
  customerDetails: any = {};
  addressForm: any; address_fields: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private router: Router,
    public commonService: CommonService, private customerApi: CustomerApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setting/customers/guest-user";
      this.commonService.secondary_header = "Customer Details";
      this.pageLoader = true;
      this.customerApi.GUEST_USER_DETAILS(params.id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.customerDetails = result.data;
          this.customerDetails.name = this.customerDetails.email;
          this.commonService.secondary_header = this.customerDetails.email;
        }
        else console.log("response", result);
      });
    });
  }

  goOrdersPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/orders/product/"+type+"/"+customer.email])
  }
  goQuotPage(customer, type) {
    this.commonService.selected_customer = customer;
    this.router.navigate(["/orders/quotations/"+type+"/"+customer.email])
  }

  onViewCustomer(x, modalName) {
    this.addressForm = {};
    let addrData = x;
    this.onEditCountryChange(addrData.country);
    for(let key in addrData) {
      if(addrData.hasOwnProperty(key)) this.addressForm[key] = addrData[key];
    }
    this.address_fields.forEach(element => {
      element.value = this.addressForm[element.keyword];
    });
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  onEditCountryChange(x) {
    this.address_fields = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      let countryDetails = this.commonService.country_list[index];
      this.addressForm.dial_code = countryDetails.dial_code;
      this.address_fields = countryDetails.address_fields;
    }
  }

}