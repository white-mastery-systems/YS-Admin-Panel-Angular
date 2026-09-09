import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-vendor-wallet-mgmt',
    templateUrl: './vendor-wallet-mgmt.component.html',
    styleUrls: ['./vendor-wallet-mgmt.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class VendorWalletMgmtComponent implements OnInit {

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

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }       
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit(): void {
    this.razorpayOptions = {
      my_order_type: "vendor_wallet",
      customer_email: this.commonService.vendor_details.email,
      customer_name: this.commonService.vendor_details.contact_person,
      customer_mobile: this.commonService.vendor_details.mobile
    };
    this.commonService.redirect = "/vendor-account";
    this.commonService.secondary_header = "Wallet";
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
    this.getList();
  }

  getList() {
    this.pageLoader = true;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
    this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
    this.api.VENDOR_WALLET_STATEMENT(this.filterForm).subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.balance = result.balance;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onTopup() {
    let pIndex = this.commonService.payment_list.findIndex(el => el.name=='Razorpay' && el.status=='active');
    if(pIndex!=-1) {
      let paymentConfig = this.commonService.payment_list[pIndex].app_config;
      this.orderForm.submit = true;
      this.api.VENDOR_WALLET_TOPUP({ order_price: this.orderForm.price, payment_details:{ name: "Razorpay" } }).subscribe(result => {
        this.orderForm.submit = false;
        if(result.status) {
          this.razorpayOptions.my_order_id = result.data.order_id;
          this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
          this.razorpayOptions.key = paymentConfig.key;
          this.razorpayOptions.store_name = paymentConfig.name;
          this.razorpayOptions.description = paymentConfig.description;
          setTimeout(_ => this.razorpayForm.nativeElement.submit());
        }
        else {
          this.orderForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}