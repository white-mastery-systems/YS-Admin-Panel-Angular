import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AccountService } from '../../account/account.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-vendor-payments',
    templateUrl: './vendor-payments.component.html',
    styleUrls: ['./vendor-payments.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class VendorPaymentsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10; list: any = [];
  pageLoader: boolean; filterForm:any = {}; tempFilter: any = {};

  constructor(public commonService: CommonService, private api: AccountService, config: NgbModalConfig, public modalService: NgbModal) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), status: "active" };
    this.getList();
  }

  getList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.api.VENDOR_PAYMENTS(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) this.list = result.list;
        else console.log("response", result);
      });
    }
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

}