import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../../setup.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-extra-pages',
  templateUrl: './extra-pages.component.html',
  styleUrls: ['./extra-pages.component.scss'],
  animations: [SharedAnimations]
})

export class ExtraPagesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  addForm: any = {};

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.secondary_header = "Extra Pages";
    this.commonService.redirect = "/setup";
    if(this.commonService.desktop_device) this.commonService.redirect = "/setup/pages";
    this.pageLoader = true;
    this.api.EXTRA_PAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.list = result.list;
      else console.log("response", result);
    });
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_EXTRA_PAGE(this.deleteForm).subscribe(result => {
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

  //Add New page 
  onAdd() {
    this.addForm.submit = true;
    this.addForm.store_id = this.commonService.store_details._id;
    this.api.ADD_EXTRA_PAGE(this.addForm).subscribe(result => {
      this.addForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addForm.err_msg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangeTitle() {
    this.addForm.page_url = this.commonService.urlFormat(this.addForm.name);
    let tempName = this.addForm.name.substring(0, 70);
    this.addForm.seo_details.h1_tag = tempName;
    this.addForm.seo_details.page_title = tempName;
  }

}