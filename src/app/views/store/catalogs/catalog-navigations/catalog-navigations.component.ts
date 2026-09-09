import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-catalog-navigations',
    templateUrl: './catalog-navigations.component.html',
    styleUrls: ['./catalog-navigations.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class CatalogNavigationsComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; maxRank: any = 0;
  addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  popupLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  title: string;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.pageLoader = true; this.params = params;
      this.commonService.redirect = "/product-sections/catalogs";
      this.storeApi.CATALOG_NAVIGATION_LIST(params.id).subscribe(result => {
        if(result.status) {
          this.list = result.list;
          this.title = result.catalog_details?.name+" - Navigations";
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  // ADD
  openAddMenuModal(modalName) {
    this.maxRank = this.list.length;
    this.addForm = { rank: this.list.length+1 };
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
  }
  onAdd() {
    this.addForm.section_id = this.params.id;
    this.storeApi.ADD_CATALOG_NAVIGATION(this.addForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.editForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.storeApi.CATALOG_NAVIGATION_DETAILS(this.params.id, x._id).subscribe(result => {
      if(result.status) {
        this.popupLoader = false;
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
      }
      else console.log("response", result);
    });
  }

  // UPDATE
  onUpdate() {
    this.storeApi.UPDATE_CATALOG_NAVIGATION(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // DELETE
  onDelete() {
    this.storeApi.DELETE_CATALOG_NAVIGATION(this.deleteForm).subscribe(result => {
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