import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-wallet-mgmt',
    templateUrl: './wallet-mgmt.component.html',
    styleUrls: ['./wallet-mgmt.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class WalletMgmtComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; orderForm: any = {};
  environment: any = environment;
  filterForm:any = {}; razorpayOptions: any = {};
  balance: number = 0; tempFilter: any = {};

  @ViewChild('razorpayForm', {static: false}) razorpayForm: ElementRef;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, public commonService: CommonService, public router: Router) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.razorpayOptions = {
      my_order_type: "store_wallet",
      customer_email: this.commonService.store_details.email,
      customer_name: this.commonService.store_details.company_details.name,
      customer_mobile: this.commonService.store_details.company_details.dial_code+this.commonService.store_details.company_details.mobile
    };
    this.commonService.redirect = "/account";
    this.commonService.secondary_header = "Wallet";
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }       
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  getList() {
    this.pageLoader = true;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
    }
    this.api.WALLET_STATEMENT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.balance = result.balance;
        this.commonService.store_details.wallet = this.balance;
        this.commonService.updateLocalData('store_details', this.commonService.store_details);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onTopup() {
    this.orderForm.submit = true;
    this.api.WALLET_TOPUP({ order_price: this.orderForm.price, order_info: "Top Up" }).subscribe(result => {
      this.orderForm.submit = false;
      if(result.status) {
        if(result.data.payment_method=='Razorpay') {
          let paymentConfig = result.data.payment_config;
          this.razorpayOptions.my_order_id = result.data.order_id;
          this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
          this.razorpayOptions.key = paymentConfig.key;
          this.razorpayOptions.store_name = paymentConfig.name;
          this.razorpayOptions.description = paymentConfig.description;
          setTimeout(_ => this.razorpayForm.nativeElement.submit());
        }
        else if(result.data.payment_method=="Stripe") {
          window.location.href = result.data.payment_url;
        }
        else console.log("Invalid payment method");
      }
      else {
        this.orderForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}