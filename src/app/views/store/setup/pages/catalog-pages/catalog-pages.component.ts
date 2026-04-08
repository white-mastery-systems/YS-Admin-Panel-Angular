import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../../setup.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-catalog-pages',
  templateUrl: './catalog-pages.component.html',
  styleUrls: ['./catalog-pages.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogPagesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  addForm: any = {};
  pageCategories: any[] = [
    { name: 'Hotel', value: 'hotel' },
    { name: 'Serviced Apartment', value: 'serviced_apartment' }
  ];

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.secondary_header = 'Catalog Pages';
    this.commonService.redirect = '/setup';
    if (this.commonService.desktop_device) this.commonService.redirect = '/setup/pages';
    this.pageLoader = true;
    this.api.CATALOG_PAGE_LIST().subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if (result.status) this.list = result.list;
      else console.log('response', result);
    });
  }

  onAdd() {
    this.addForm.submit = true;
    this.addForm.store_id = this.commonService.store_details._id;
    this.api.ADD_CATALOG_PAGE(this.addForm).subscribe(result => {
      this.addForm.submit = false;
      if (result.status) {
        document.getElementById('closeAddModal').click();
        this.ngOnInit();
      } else {
        this.addForm.err_msg = result.message;
        console.log('response', result);
      }
    });
  }

  onDelete() {
    this.api.DELETE_CATALOG_PAGE(this.deleteForm).subscribe(result => {
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      } else {
        this.deleteForm.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

  onChangeTitle() {
    this.addForm.page_url = this.commonService.urlFormat(this.addForm.name);
    let tempName = this.addForm.name.substring(0, 70);
    this.addForm.seo_details.h1_tag = tempName;
    this.addForm.seo_details.page_title = tempName;
  }

  getPageCategoryName(value: string) {
    const index = this.pageCategories.findIndex(obj => obj.value === value);
    return index !== -1 ? this.pageCategories[index].name : '-';
  }

}
