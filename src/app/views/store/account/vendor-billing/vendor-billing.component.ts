import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import { DeploymentService } from '../../deployment/deployment.service';

@Component({
    selector: 'app-vendor-billing',
    templateUrl: './vendor-billing.component.html',
    styleUrls: ['./vendor-billing.component.scss'],
    standalone: false
})

export class VendorBillingComponent implements OnInit {

  pageLoader: boolean;
  environment: any = environment;
  billDetails: any = {}; vendorDetails: any = {}; razorpayOptions: any = {};
  @ViewChild('razorpayForm', { static: false }) razorpayForm: ElementRef;
  periodName: any = {
    30: "Monthly", 90: "Quarterly", 180: "Haly-Yearly", 360: "Annual"
  };

  constructor(config: NgbModalConfig, public modalService: NgbModal, public cs: CommonService, public router: Router, private api: DeploymentService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true;
    this.razorpayOptions = {
      my_order_type: 'vendor_subscription',
      customer_email: this.cs.vendor_details.email,
      customer_name: this.cs.vendor_details.contact_person,
      customer_mobile: this.cs.vendor_details.mobile
    };
    if(!this.cs.desktop_device && this.cs.store_details?.status == 'active') {
      this.cs.redirect = '/account';
      this.cs.secondary_header = 'Vendor Subscription';
    }
    this.api.VENDOR_BILLING_DETAILS({ store_id: this.cs.store_details._id, vendor_id: this.cs.vendor_details._id }).subscribe((result) => {
      this.pageLoader = false;
      if(result.status) {
        this.billDetails = result.data;
        this.vendorDetails = result.data.vendor_details;
        this.billDetails.tax_percentage = 0;
        this.billDetails.tax_amount = 0;
        if(this.billDetails.sgst?.percentage) {
          this.billDetails.tax_percentage += this.billDetails.sgst.percentage;
          this.billDetails.tax_amount += this.billDetails.sgst.amount;
        }
        if(this.billDetails.cgst?.percentage) {
          this.billDetails.tax_percentage += this.billDetails.cgst.percentage;
          this.billDetails.tax_amount += this.billDetails.cgst.amount;
        }
        if(this.billDetails.igst?.percentage) {
          this.billDetails.tax_percentage += this.billDetails.igst.percentage;
          this.billDetails.tax_amount += this.billDetails.igst.amount;
        }
      }
      else console.log('response', result);
    });
  }

  onSubscribe() {
    this.billDetails.submit = true;
    this.api.VENDOR_BILLING_DETAILS({ store_id: this.cs.store_details._id, vendor_id: this.cs.vendor_details._id, make_payment: true }).subscribe((result) => {
      if(result.status) {
        if(result.data.payment_method == 'Razorpay')
        {
          let paymentConfig = result.data.payment_config;
          this.razorpayOptions.my_order_id = result.data.order_id;
          this.razorpayOptions.vendor_id = this.cs.vendor_details._id;
          this.razorpayOptions.razorpay_order_id = result.data.razorpay_response.id;
          this.razorpayOptions.key = paymentConfig.key;
          this.razorpayOptions.store_name = paymentConfig.name;
          this.razorpayOptions.description = paymentConfig.description;
          setTimeout((_) => this.razorpayForm.nativeElement.submit());
        }
        else {
          this.billDetails.submit = false;
          this.billDetails.errorMsg = 'Invalid payment method';
        }
      }
      else {
        this.billDetails.submit = false;
        this.billDetails.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

}