import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class FaqComponent implements OnInit {

  page = 1; pageSize = 10;
	list: any = []; maxRank: any = 0;
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  vendor_id: string = ""; tempFilter: any = {};
  popupLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  onOpenFilterModal(modalName) 
  {
    this.tempFilter = this.vendor_id;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  ngOnInit() {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "FAQ";
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.pageLoader = true; this.list = [];
    this.api.FAQ_LIST(this.vendor_id).subscribe(result => {
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
    this.api.ADD_FAQ(this.addForm).subscribe(result => {
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
    this.editForm = {}; this.popupLoader = true;
    this.modalService.open(modalName, {size: "xl", windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.FAQ_LIST(this.vendor_id).subscribe(result => {
			if(result.status) {
        let noteList = result.list;
        let index = noteList.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = noteList[index];
          this.editForm.prev_rank = this.editForm.rank;
          this.popupLoader = false;
        }
        else console.log("invalid faq");
      }
      else console.log("response", result);
		});
  }
  
  // UPDATE
  onUpdate() {
    this.editForm.submit = true;
    if(this.vendor_id) this.editForm.vendor_id = this.vendor_id;
		this.api.UPDATE_FAQ(this.editForm).subscribe(result => {
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
    this.api.DELETE_FAQ(this.deleteForm).subscribe(result => {
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

}