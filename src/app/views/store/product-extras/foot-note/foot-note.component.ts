import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-foot-note',
  templateUrl: './foot-note.component.html',
  styleUrls: ['./foot-note.component.scss'],
  animations: [SharedAnimations]
})

export class FootNoteComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = ""; tempFilter: any = {};
  popupLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService,
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
    this.commonService.secondary_header = "Foot Note";
    this.pageLoader = true; this.list = [];
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.api.FOOTNOTE_LIST(this.vendor_id).subscribe(result => {
			if(result.status) {
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
		});
  }

  // ADD
  onAdd() {
    this.addForm.submit = true;
    if(this.vendor_id) this.addForm.vendor_id = this.vendor_id;
    this.api.ADD_FOOTNOTE(this.addForm).subscribe(result => {
      this.addForm.submit = false;
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.list;
				this.maxRank = this.list.length;
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEdit(x, modalName) {
    this.popupLoader = true; this.editForm = {};
    this.modalService.open(modalName, {size: "xl", windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.FOOTNOTE_LIST(this.vendor_id).subscribe(result => {
			if(result.status) {
        let noteList = result.list;
        let index = noteList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = noteList[index];
          this.editForm.prev_rank = this.editForm.rank;
          this.popupLoader = false;
        }
        else console.log("invalid foot note");
      }
      else console.log("response", result);
		});
  }
  
  // UPDATE
  onUpdate() {
    this.editForm.submit = true;
    if(this.vendor_id) this.editForm.vendor_id = this.vendor_id;
		this.api.UPDATE_FOOTNOTE(this.editForm).subscribe(result => {
      this.editForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    if(this.vendor_id) this.deleteForm.vendor_id = this.vendor_id;
    this.api.DELETE_FOOTNOTE(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
				this.maxRank = this.list.length;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  exportAsXLSX() {
    let vendorName = "";
    if(this.commonService.store_details?.login_type!='vendor' && this.vendor_id) {
      let vIndex = this.commonService.vendor_list.findIndex(obj => obj._id==this.vendor_id);
      if(vIndex!=-1) vendorName = this.commonService.vendor_list[vIndex].company_details.brand+" - ";
    }
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, vendorName+'Foot Note '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    });   
  }
  async createList(list) {
    let updatedList = [];
    for(let fn of list) {
      let optList = [];
      fn.option_list.forEach(el => { optList.push(el.description); });
      updatedList.push({ 'Name': fn.name, 'Options': optList.join(', ') });
    }
    return updatedList;
  }

}