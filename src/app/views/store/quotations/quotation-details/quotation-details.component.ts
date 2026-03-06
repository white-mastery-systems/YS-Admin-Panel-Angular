import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuotationService } from '../quotation.service';
import { OrderService } from '../../orders/order.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss']
})

export class QuotationDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {}; courierForm: any;
  custom_model: any = {}; customNext: boolean;
  imgBaseUrl = environment.img_baseurl; updateErrorMsg: string;
  btnLoader: boolean; mailForm: any;
  errorMsg: string; pageLoader: boolean;
  editForm: any = {}; itemIndex: number;
  country_list: any = []; state_list: any = [];
  addressType: string; addressForm: any = {};
  customizationForm: any; mmIndex: number;
  custom_list: any = []; customIndex: number;
  existing_custom_list = []; selected_custom_list = [];
  invoice_details: any; invoice_order_list: any;
  quotForm: any = {}; orderForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute, private router: Router,
    private api: QuotationService, public commonService: CommonService, private orderApi: OrderService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.country_list = this.commonService.country_list;
      this.commonService.redirect = "/orders/quotations/"+params.type+"/"+params.customer_id;
      this.commonService.secondary_header = " ";
      this.params = params; this.courierForm = {};
      this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      this.api.QUOTATION_DETAILS(this.params.quot_id).subscribe(result => {
        if(result.status) {
          this.order_details = result.data;
          if(!this.order_details.billing_address)
            this.order_details.billing_address = this.order_details.company_address;
          this.commonService.secondary_header = "#"+this.order_details.quot_number;
          this.order_details.existing_status = this.order_details.quot_status;
          if(this.order_details.existing_status=='placed') this.order_details.quot_status='confirmed';
          if(this.order_details.existing_status=='confirmed') this.order_details.quot_status='dispatched';
          if(this.order_details.existing_status=='dispatched') this.order_details.quot_status='delivered';
          this.order_details.customer_email = this.order_details.guest_email;
          if(this.order_details.customerDetails[0]?.email) this.order_details.customer_email = this.order_details.customerDetails[0].email;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onCreateOrder() {
    this.orderForm.submit = true;
    this.orderForm._id = this.order_details._id;
    this.orderApi.PLACE_QUOTE_ORDER(this.orderForm).subscribe(result => {
      this.orderForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/orders/product/live/all']);
      }
      else {
        this.orderForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  onSendQuotation(x) {
    this.quotForm.submit = true;
    this.api.SEND_QUOTATION(x).subscribe(result => {
      this.quotForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/orders/quotations/live/"+this.params.customer_id]);
      }
      else {
        this.quotForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onConfirmOrder() {
    this.btnLoader = true;
    this.api.QUOTATION_STATUS({ _id: this.order_details._id, type: 'confirm' }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/orders/quotations/confirmed/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // cancel order
  onCancelOrder() {
    this.btnLoader = true;
    this.api.QUOTATION_STATUS({ _id: this.order_details._id, type: 'cancel' }).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(["/orders/quotations/cancelled/"+this.params.customer_id]);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEdit(type, modalName) {
    this.api.QUOTATION_DETAILS(this.params.quot_id).subscribe(result => {
      if(result.status) {
        if(type=='address') {
          this.addressForm = result.data.company_address;
          if(this.addressType=='billing') this.addressForm = result.data.billing_address;
          this.onCountryChange(this.addressForm.country);
          this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
        }
        else if(type=='product') {
          this.editForm = result.data;
          this.modalService.open(modalName, {size: 'lg', windowClass: 'scroll-modal-xl', scrollable : true});
        }
        else {
          this.editForm = result.data;
          this.modalService.open(modalName);
        }
      }
      else console.log("response", result);
    });
  }

  // update
  onUpdateProduct() {
    this.editForm.sub_total = 0;
    this.editForm.item_list.forEach((product) => {
      this.editForm.sub_total += (product.revised_final_price * product.quantity);
      if(product.unit!="Pcs") this.editForm.sub_total += parseFloat(product.revised_addon_price);
    });
    this.editForm.final_price = parseFloat(this.editForm.sub_total)+parseFloat(this.editForm.shipping_cost);
    let formData = {
      _id: this.editForm._id, item_list: this.editForm.item_list, sub_total: this.editForm.sub_total,
      shipping_cost: this.editForm.shipping_cost, final_price: this.editForm.final_price
    };
    this.api.UPDATE_QUOTATION_DETAILS(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onUpdate(x) {
    this.api.UPDATE_QUOTATION_DETAILS(x).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onUpdateAddress() {
    let formData: any = { _id: this.order_details._id, company_address: this.addressForm };
    if(this.addressType=='billing') formData = {_id: this.order_details._id, billing_address: this.addressForm };
    this.api.UPDATE_QUOTATION_DETAILS(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addressForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.country_list.findIndex(object => object.name==x);
    if(index!=-1) {
      this.state_list = this.country_list[index].states;
      this.addressForm.dial_code = this.country_list[index].dial_code;
    }
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

}