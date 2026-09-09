import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
    selector: 'app-addons',
    templateUrl: './addons.component.html',
    styleUrls: ['./addons.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class AddonsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	deleteForm: any; search_bar: string;
  pageLoader: boolean; scrollPos: number = 0;
  btnForm: any = {}; vendor_id: string = ""; tempFilter: any = {};

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService,
    private datepipe: DatePipe, public commonService: CommonService, private storeApi: StoreApiService, private excelService: ExcelService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = this.vendor_id;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Add-Ons";
    if(sessionStorage.getItem("vid")) {
      this.vendor_id = sessionStorage.getItem("vid");
      sessionStorage.removeItem("vid");
    }
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
    }
    this.pageLoader = true; this.list = [];
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.api.ADDON_LIST(this.vendor_id).subscribe(result => {
			if(result.status) {
        // category list
        this.list = result.list;
        this.list.forEach((object) => {
          object.options_count = 0;
          object.custom_list.forEach((obj) => {
            object.options_count += obj.option_list.length;
          });
        });
        // get max rank
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
		});
  }

  openBtnModal(modalName) {
    this.storeApi.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.btnForm = result.data.application_setting.customize_name;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }
  onUpdateSetting() {
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ "application_setting.customize_name": this.btnForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.btnForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // DELETE
  onDelete() {
    if(this.vendor_id) this.deleteForm.vendor_id = this.vendor_id;
    this.api.DELETE_ADDON(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        // category list
        this.list = result.list;
        this.list.forEach((object) => {
          object.options_count = 0;
          object.custom_list.forEach((obj) => {
            object.options_count += obj.option_list.length;
          });
        });
        // get max rank
        this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  goModifyPage(x) {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
    if(this.vendor_id) this.router.navigate(['/product-extras/addons/modify/'+x._id+'/'+this.maxRank+'/'+this.vendor_id]);
    else this.router.navigate(['/product-extras/addons/modify/'+x._id+'/'+this.maxRank]);
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
      this.excelService.exportAsExcelFile(exportList, vendorName+'Add-ons '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    }
  }

}