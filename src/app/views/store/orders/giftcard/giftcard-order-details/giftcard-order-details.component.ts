import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../order.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-giftcard-order-details',
    templateUrl: './giftcard-order-details.component.html',
    styleUrls: ['./giftcard-order-details.component.scss'],
    standalone: false
})

export class GiftcardOrderDetailsComponent implements OnInit {

  imgBaseUrl = environment.img_baseurl;
  pageLoader: boolean;
  params: any = {}; details: any = {};
  editForm: any = {}; mailForm: any = {};
  btnLoader: boolean; invoice_details: any;
  deleteForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router,
    private api: OrderService, private activeRoute: ActivatedRoute, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/orders/gift-coupon";
      this.commonService.secondary_header = " ";
      this.pageLoader = true; this.params = params;
      this.api.COUPON_DETAILS({ _id: this.params.coupon_id }).subscribe(result => {
        if(result.status) {          
          this.details = result.data;
          if(this.details.order_note) {
            this.details.disp_order_note = this.transformHtml(this.details.order_note);
          }
          this.commonService.secondary_header = "#"+this.details.order_number;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onEdit(modalName) {
    this.editForm = {};
    this.api.COUPON_DETAILS({ _id: this.params.coupon_id }).subscribe(result => {
      if(result.status) {
        this.editForm = result.data;
        this.modalService.open(modalName);
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // update
  onUpdate(x) {
    this.api.UPDATE_COUPON_DETAILS(x).subscribe(result => {
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

  // Delete
  onDelete() {
    this.api.DELETE_COUPON({ _id: this.deleteForm._id }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  sendMail() {
    this.btnLoader = true;
    this.mailForm._id = this.details._id;
    this.api.RESEND_COUPON_MAIL(this.mailForm).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        document.getElementById('closeModal').click();
      }
      else {
        this.mailForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

}