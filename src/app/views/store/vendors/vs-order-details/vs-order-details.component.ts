import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderService } from '../../orders/order.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-vs-order-details',
    templateUrl: './vs-order-details.component.html',
    styleUrls: ['./vs-order-details.component.scss'],
    standalone: false
})

export class VsOrderDetailsComponent implements OnInit {

  settlement_info: any = {};
  pageLoader: boolean; itemList: any = [];
  vendorOrderDetails: any = {}; vendorInfo: any = {};
  imgBaseUrl = environment.img_baseurl;
  itemInfo: any = {}; statusForm: any = {};
  editForm: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private api: OrderService, public commonService: CommonService, private router: Router
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true;
      this.commonService.redirect = "/vendors/settlement";
      this.commonService.secondary_header = " ";
      // order details
      this.api.SETTLEMENT_ORDERS({ _id: params.id }).subscribe(result => {
        if(result.status) {
          this.settlement_info = result.data;
          this.vendorOrderDetails = result.data.orderDetails;
          this.commonService.secondary_header = '#'+this.settlement_info.order_number;
          this.itemList = result.data.item_list;
          this.itemList.forEach(el => {
            el.item_price = el.final_price*el.quantity;
            if(el.unit!='Pcs') el.item_price += el.addon_price;
          });
          // vendor details
          let vIndex = this.commonService.vendor_list.findIndex(el => el._id==this.settlement_info.vendor_id);
          if(vIndex!=-1) this.vendorInfo = this.commonService.vendor_list[vIndex];
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  onChangeStatus() {
    this.statusForm.submit = true;
    let formData: any = { _id: this.settlement_info._id, form_type: "change_status", status: this.statusForm.status };
    if(this.statusForm.status=='paid') formData.settled_on = new Date();
    if(this.statusForm.status=='cancelled') formData.cancelled_on = new Date();
    this.api.UPDATE_SETTLEMENT_ORDER(formData).subscribe(result => {
      this.statusForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/vendors/settlement']);
      }
      else {
        this.statusForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdatePrice() {
    this.editForm.submit = true;
    let formData: any = { _id: this.settlement_info._id, form_type: "change_price", dp_charges: this.editForm.dp_charges };
    this.api.UPDATE_SETTLEMENT_ORDER(formData).subscribe(result => {
      this.editForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/vendors/settlement']);
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}