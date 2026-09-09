import { Component, OnInit } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../../orders/order.service';
import { CommonService } from '../../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../../../services/excel.service';

@Component({
    selector: 'app-vendor-settlement',
    templateUrl: './vendor-settlement.component.html',
    styleUrls: ['./vendor-settlement.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class VendorSettlementComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; filterForm: any = {};
  list: any = []; scrollPos: number = 0;
  outstanding: number = 0;
  tempFilter: any = {}; selectedItem: any;

  status_list : any = [
    {name : 'All', value : 'all'},
    {name : 'Paid', value : 'paid'},
    {name : 'Pending', value : 'pending'},
    {name : 'Cancelled', value : 'cancelled'}
  ]

  constructor(
    private api: OrderService, public commonService: CommonService, private excelService: ExcelService,
    public modalService: NgbModal, private datepipe: DatePipe, private titleCase: TitleCasePipe
  ) { }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }
    this.selectedItem = "Vendor";
    if(this.commonService.store_details?.login_type=='vendor') this.selectedItem = "OrderDate";
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    this.filterForm = {
      from_date: new Date(new Date().setDate(new Date().getDate() - 15)), to_date: new Date(new Date().setDate(new Date().getDate() + 15)),
      vendor_id: 'all', list_type: 'all'
    };
    if(sessionStorage.getItem("vs_page")) {
      let pageInfo = JSON.parse(sessionStorage.getItem("vs_page"));
      sessionStorage.removeItem("vs_page");
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
      this.filterForm.vendor_id = pageInfo.filter_form.vendor_id;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      this.filterForm.list_type = pageInfo.filter_form.list_type;
    }
    this.getOrderList();
  }

  getOrderList() {
    this.list = []; this.outstanding = 0;
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.pageLoader = true;
      if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
      this.api.SETTLEMENT_ORDERS(this.filterForm).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.list.forEach(obj => {
            obj.vendor_name = "NA"; obj.vendor_gst = "NA"; obj.v_country = "";
            let vendorIndex = this.commonService.vendor_list.findIndex(el => el._id==obj.vendor_id);
            if(vendorIndex!=-1) {
              let vendorData = this.commonService.vendor_list[vendorIndex];
              obj.v_country = vendorData.registered_address.country;
              obj.v_state = vendorData.registered_address.state;
              obj.vendor_name = vendorData.company_details.brand;
              if(vendorData.company_details.gst_no) {
                obj.vendor_gst = vendorData.company_details.gst_no;
              }
              if(vendorData.company_details.tin_no) {
                obj.vendor_gst = vendorData.company_details.tin_no;
              }
            }
            if(obj.status=='pending') this.outstanding += obj.settlement_amt;
          });
          
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
      });
    }
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem("vs_page", JSON.stringify(pageData));
  }

  exportAsXLSX() {
    let exportList = [];
    this.list.forEach(obj => {
      let sendData = {
        "Invoice No": "", "Invoice Date": "", "Vendor": obj.vendor_name, "Order ID": obj.order_number,
        "Settlement Date": this.datepipe.transform(obj.settlement_on, 'dd MMM y'),
        "Net Value": (obj.total_cmsn - obj.cmsn_tax), "SGST": 0, "CGST": 0, "IGST": 0, "Total GST": obj.cmsn_tax,
        "Invoice Value": (obj.order_total - obj.settlement_amt), "GST No": obj.vendor_gst, "Status": this.titleCase.transform(obj.status)
      };
      if(this.commonService.store_details?.country=='India') {
        if(this.commonService.store_details?.country==obj.v_country && this.commonService.store_details?.company_details?.state==obj.v_state) {
          sendData['SGST'] = obj.cmsn_tax/2;
          sendData['CGST'] = obj.cmsn_tax/2;
        }
        else sendData['IGST'] = obj.cmsn_tax;
      }
      else sendData['IGST'] = obj.cmsn_tax;
      if(obj.status=='paid') {
        if(obj.invoice_number) sendData['Invoice No'] = obj.invoice_number;
        sendData['Invoice Date'] = this.datepipe.transform(obj.settled_on, 'dd MMM y');
      }
      exportList.push(sendData);
    });
    let fileName = 'Settlement Orders from '+this.datepipe.transform(this.filterForm.from_date, 'dd MMM y')+" to "+this.datepipe.transform(this.filterForm.to_date, 'dd MMM y');
    this.excelService.exportAsExcelFile(exportList, fileName);
  }

}