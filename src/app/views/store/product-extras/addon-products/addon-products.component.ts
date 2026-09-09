import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { environment } from 'src/environments/environment';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-addon-products',
    templateUrl: './addon-products.component.html',
    styleUrls: ['./addon-products.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class AddonProductsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
	deleteForm: any; search_bar: string;
  pageLoader: boolean; scrollPos: number = 0;
  tempFilter: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: ProductExtrasApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  
  ngOnInit(): void {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Addon Products";
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      delete this.commonService.page_attr;
      this.scrollPos = pageInfo.scroll_pos;
      this.page = pageInfo.page_no;
      this.search_bar = pageInfo.search;
    }
    this.pageLoader = true; this.list = [];
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    this.api.ADDON_PRODUCTS_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
        // get max rank
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
		});
  }

  goModifyPage(x) {
    this.commonService.page_attr = { page_no: this.page, search: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(['/product-extras/addon-products/modify/'+x._id+'/'+this.maxRank]);
  }

  // DELETE
  onDelete() {
    this.api.DELETE_ADDON_PRODUCTS(this.deleteForm).subscribe(result => {
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

}