import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
    selector: 'app-customer-enquiries',
    templateUrl: './customer-enquiries.component.html',
    styleUrls: ['./customer-enquiries.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class CustomerEnquiriesComponent implements OnInit {

  exportLoader: boolean;
  page = 1; pageSize = 10; btnLoader: boolean;
  pageLoader: boolean; totalCount: number = 0;
  totalPages: number = 0; pagesList: any = [];
  list: any = []; details: any = {}; tempFilter: any = {};
  filterForm: any = { type: "all", from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, private datePipe: DatePipe,
    public commonService: CommonService, private excelService: ExcelService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm)
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }       
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      this.filterForm.skip = (this.page-1)*this.pageSize; this.filterForm.limit = this.pageSize;
      if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
      if(this.filterForm.from_date && this.filterForm.to_date) {
        this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
        this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      }
      this.api.CUSTOMER_ENQUIRY(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.totalCount = result.count;
          this.totalPages = Math.ceil(this.totalCount/this.pageSize);
          this.pagesList = new Array(this.totalPages);
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    }
  }

  onUpdate() {
    this.btnLoader = true;
    let newStatus = "contacted";
    if(this.details.status=='contacted') newStatus = "new";
    this.api.UPDATE_CUSTOMER_ENQUIRY({ id: this.details._id, status: newStatus }).subscribe(result => {
      this.ngOnInit();
    });
  }

  onChangePage(type) {
    this.commonService.pageTop(0);
    if(type=='prev') this.page--;
    else this.page++;
    this.ngOnInit();
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let reqData = Object.assign(this.filterForm);
    delete reqData.skip; delete reqData.limit;
    this.api.CUSTOMER_ENQUIRY(reqData).subscribe(result => {
      if(result.status) {
        let dataList = [];
        for(let el of result.list) {
          let eType = "Contact Us";
          if(el.type=='product_enquiry') eType = "Product";
          else if(el.type=='vendor_enquiry') eType = "Vendor";
          if(!el.message) el.message = "";
          if(!el.prod_name) el.prod_name = "";
          if(!el.prod_sku) el.prod_sku = "";
          el.status = el.status.charAt(0).toUpperCase() + el.status.slice(1);
          let sendData = {
            Name: el.name, Email: el.email, Mobile: el.mobile, Date: this.datePipe.transform(el.created_on, 'dd MMM y'),
            Type: eType, Status: el.status, Message: el.message, "Product Name": el.prod_name, "Product SKU": el.prod_sku
          }
          dataList.push(sendData);
        }
        this.excelService.exportAsExcelFile(dataList, 'enquries'+' export '+new Date().getTime());
        setTimeout(() => { this.exportLoader = false; }, 500);
      }
      else {
        console.log("response", result);
        setTimeout(() => { this.exportLoader = false; }, 500);
      }
    });
  }

}