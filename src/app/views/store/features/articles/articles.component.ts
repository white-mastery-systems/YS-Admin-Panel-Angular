import { Component } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { CommonService } from 'src/app/services/common.service';
import { StoreApiService } from 'src/app/services/store-api.service';
import { environment } from 'src/environments/environment';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  animations: [SharedAnimations]
})
export class ArticlesComponent {


  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  articleForm: any; deleteForm: any;
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
    let url = '/articles';
    if(this.commonService.selected_article_catalog?.seo_details?.page_url) {
      url = '/articles/'+this.commonService.selected_article_catalog.seo_details.page_url;
    }
    window.open(this.commonService.store_details?.base_url+url);
  }
  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Articles";
    }
    this.pageLoader = true;
    let catId = null;
    if(this.commonService.selected_article_catalog?._id) catId = this.commonService.selected_article_catalog._id;
    this.api.ARTICLE_LIST(catId).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.articleForm = x;
    this.articleForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.api.UPDATE_ARTICLE({ _id: this.articleForm._id, status: this.articleForm.change_status+"d" }).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
			else {
				this.articleForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_ARTICLE(this.deleteForm).subscribe(result => {
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
        if(result.data.article_seo) {
          this.seoForm = result.data.article_seo;
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
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ article_seo: this.seoForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  ngOnDestroy() {
    delete this.commonService.selected_article_catalog;
  }
}
