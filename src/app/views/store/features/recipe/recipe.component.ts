import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class RecipeComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  blogForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  seoForm: any = {}; popupLoader: boolean;
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  open_website()
  {
    window.open(this.commonService.store_details?.base_url+'/recipes');
  }
  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Recipes";
    }
    this.pageLoader = true;
    this.api.RECIPE_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list;
        this.commonService.recipe_list = [];
        for(let x of this.list) {
          this.commonService.recipe_list.push({ _id: x._id, name: x.name });
        }
        this.commonService.updateLocalData('recipe_list', this.commonService.recipe_list);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.blogForm = x;
    this.blogForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.api.UPDATE_RECIPE({ _id: this.blogForm._id, status: this.blogForm.change_status+"d" }).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
			else {
				this.blogForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_RECIPE(this.deleteForm).subscribe(result => {
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

  // SEO update
  openSettingModal(modalName) {
    this.seoForm = {}; this.popupLoader = true;
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable : true });
    this.storeApi.STORE_PROPERTY_DETAILS().subscribe((result) => {
      if(result.status) {
        this.popupLoader = false;
        if(result.data.recipe_seo) {
          this.seoForm = result.data.recipe_seo;
          this.seoForm.meta_keyword_list = [];
          if(this.seoForm.meta_keywords.length) {
            this.seoForm.meta_keywords.forEach(obj => {
              this.seoForm.meta_keyword_list.push({display: obj, value: obj});
            });
          }
        }
      }
      else console.log("response", result);
    });
  }
  onUpdateSetting() {
    if(this.seoForm.status) {
      this.seoForm.meta_keywords = [];
      if(this.seoForm.meta_keyword_list) {
        this.seoForm.meta_keyword_list.forEach(obj => {
          this.seoForm.meta_keywords.push(obj.value);
        });
      }
    }
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ recipe_seo: this.seoForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}