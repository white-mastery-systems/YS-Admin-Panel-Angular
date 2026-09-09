import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
    selector: 'app-product-tags',
    templateUrl: './product-tags.component.html',
    styleUrls: ['./product-tags.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class ProductTagsComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
  tagForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = ""; tempFilter: any = {};
  popupLoader: boolean;
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: ProductExtrasApiService,
    private datepipe: DatePipe, public commonService: CommonService, private excelService: ExcelService
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
    this.commonService.secondary_header = "Product Tags";
    if(this.commonService.store_details?.login_type=='vendor') this.vendor_id = this.commonService.vendor_details?._id;
    this.pageLoader = true;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.api.TAG_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;
        this.filterVendorTags();
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.popupLoader = true; this.tagForm = {};
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.TAG_LIST().subscribe(result => {
			if(result.status) {
        this.popupLoader = false;
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.tagForm = result.list[index];
          this.tagForm.form_type = 'edit';
          this.tagForm.prev_rank = this.tagForm.rank;
          if(this.vendor_id) {
            let vIndex = this.tagForm.vendor_list?.findIndex(obj => obj.vendor_id==this.vendor_id);
            if(vIndex!=-1) this.tagForm.option_list = this.tagForm.vendor_list[vIndex].option_list;
            else this.tagForm.option_list = [{}];
          }
          if(!this.tagForm.option_list?.length) this.tagForm.option_list = [{}];
        }
        else console.log("Invalid tag");
      }
      else console.log("response", result);
		});
  }

  onSubmit() {
    this.tagForm.submit = true;
    this.tagForm.option_list.forEach(el => {
      el.name = el.name.trim();
      if(this.commonService.colorNames.indexOf(this.tagForm.name)==-1 || !this.tagForm.cl_picker) delete el.value;
    });
    if(this.tagForm.form_type=='add') {
      this.api.ADD_TAG(this.tagForm).subscribe(result => {
        this.tagForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
          this.filterVendorTags();
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      if(this.vendor_id) this.tagForm.vendor_id = this.vendor_id;
      this.api.UPDATE_TAG(this.tagForm).subscribe(result => {
        this.tagForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
          this.maxRank = this.list.length;
          this.filterVendorTags();
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_TAG(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
        this.filterVendorTags();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  filterVendorTags() {
    if(this.vendor_id) {
      this.list.forEach(el => {
        el.option_list = [];
        let vIndex = el.vendor_list?.findIndex(obj => obj.vendor_id==this.vendor_id);
        if(vIndex!=-1) el.option_list = el.vendor_list[vIndex].option_list;
      });
    }
  }

  exportAsXLSX() {
    let vendorName = "";
    if(this.commonService.store_details?.login_type!='vendor' && this.vendor_id) {
      let vIndex = this.commonService.vendor_list.findIndex(obj => obj._id==this.vendor_id);
      if(vIndex!=-1) vendorName = this.commonService.vendor_list[vIndex].company_details.brand+" - ";
    }
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, vendorName+'Product Tags '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    });   
  }
  async createList(list) {
    let updatedList = [];
    for(let pTag of list) {
      let optList = [];
      pTag.option_list.forEach(el => { optList.push(el.name); });
      updatedList.push({ 'Name': pTag.name, 'Options': optList.join(', ') });
    }
    return updatedList;
  }

}