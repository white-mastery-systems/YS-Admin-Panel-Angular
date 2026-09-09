import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
    selector: 'app-size-chart',
    templateUrl: './size-chart.component.html',
    styleUrls: ['./size-chart.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class SizeChartComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = ""; tempFilter: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService,
    public commonService: CommonService, private datepipe: DatePipe, private excelService: ExcelService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  onOpenFilterModal(modalName) 
  {
    this.tempFilter = this.vendor_id;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  ngOnInit() {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Size Chart";
    this.pageLoader = true; this.list = [];
    if(sessionStorage.getItem("vid")) {
      this.vendor_id = sessionStorage.getItem("vid");
      sessionStorage.removeItem("vid");
    }
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.api.CHART_LIST(this.vendor_id).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // DELETE
  onDelete() {
    if(this.vendor_id) this.deleteForm.vendor_id = this.vendor_id;
    this.api.DELETE_CHART(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
				this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  exportAsXLSX() {
    let exportList = [];    
    if(this.list.length) {
      this.list.forEach(el => {
        exportList.push({ "Name": el.name });
      });
      let vendorName = "";
      if(this.commonService.store_details?.login_type!='vendor' && this.vendor_id) {
        let vIndex = this.commonService.vendor_list.findIndex(obj => obj._id==this.vendor_id);
        if(vIndex!=-1) vendorName = this.commonService.vendor_list[vIndex].company_details.brand+" - ";
      }
      this.excelService.exportAsExcelFile(exportList, vendorName+'Size Chart '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    }
  }

}