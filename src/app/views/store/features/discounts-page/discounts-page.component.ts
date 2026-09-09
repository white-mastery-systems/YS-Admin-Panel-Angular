import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-discounts-page',
    templateUrl: './discounts-page.component.html',
    styleUrls: ['./discounts-page.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class DiscountsPageComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; pageLoader: boolean;
  addForm: any; editForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  maxRank: any = 0; search_bar: string;
  productList: any = []; settingForm: any = {};
  searchLoader: boolean;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    private storeApi: StoreApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  open_website()
  {
    window.open(this.commonService.store_details?.base_url+'/catalog-page');
  }
  ngOnInit() {

      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Catalog Page";
    
    this.pageLoader = true;
    this.api.DISCOUNTS_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  searchProduct(catId, searchTerm) {
		this.productList = []; this.searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.storeApi.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.productList = result.list;
				else console.log("response", result);
        this.searchLoader = false;
			});
		}
	}

  // ADD
  onAdd() {
    this.addForm.submit = true;
    this.api.ADD_DISCOUNT(this.addForm).subscribe(result => {
      this.addForm.submit = false;
			if(result.status) {
				document.getElementById('closeModal').click();
				this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
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
    this.productList = [];
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.editForm[key] = x[key];
    }
    this.editForm.prev_rank = this.editForm.rank;
    if(this.editForm.link_status && this.editForm.link_type=='product' && this.editForm.product_id) {
      this.storeApi.PRODUCT_DETAILS(this.editForm.product_id).subscribe(result => {
        if(result.status) this.productList = [result.data];
        else console.log("response", result);
      });
    }
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  // UPDATE
  onUpdate() {
    this.editForm.submit = true;
    this.api.UPDATE_DISCOUNT(this.editForm).subscribe(result => {
      this.editForm.submit = false;
			if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
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
    this.api.DELETE_DISCOUNT(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  // PAGE SETTING
  onUpdateSetting() {
    this.settingForm.submit = true;
    this.api.UPDATE_DISCOUNT_CONFIG({ "page_config": this.settingForm }).subscribe(result => {
      this.settingForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.data.discount_list;
        this.maxRank = this.list.length;
        this.settingForm = {};
        if(result.data.page_config) this.settingForm = result.data.page_config;
      }
      else {
				this.settingForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  fileChangeListener(type, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        if(type=='add') {
          this.addForm.image = (<FileReader>event.target).result;
          this.addForm.img_change = true;
        }
        else {
          this.editForm.image = (<FileReader>event.target).result;
          this.editForm.img_change = true;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}
