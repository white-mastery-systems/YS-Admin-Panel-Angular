import { Component } from '@angular/core';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from 'src/app/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
    selector: 'app-article-catalogs',
    templateUrl: './article-catalogs.component.html',
    styleUrls: ['./article-catalogs.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class ArticleCatalogsComponent {

  page = 1; pageSize = 10; scrollPos: number = 0;
  list: any = []; search_bar: string; pageLoader: boolean;
  catForm : any = {}; popupLoader: boolean;

  constructor(private fApi: FeaturesApiService, public commonService: CommonService, public modalService: NgbModal) { }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting/articles";
      this.commonService.secondary_header = "Article Catalogs";
    }
    this.pageLoader = true;
    if (this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      this.page = pageInfo.page;
      this.search_bar = pageInfo.search_bar;
      this.scrollPos = pageInfo.scroll_pos;
      delete this.commonService.page_attr;
    }
    this.fApi.ARTICLE_CATALOG_LIST().subscribe(result => {
      if (result.status) {
        this.list = result.list;
        this.commonService.article_catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
        this.commonService.updateLocalData('article_catalog_list', this.commonService.article_catalog_list);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
    });
  }

  openPopup(type, data, modalName) {
    this.popupLoader = false;
    if (type == 'add') {
      this.catForm = { form_type: 'add', seo_details: {} };
      this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-lg', scrollable: true });
    }
    else {
      this.popupLoader = true;
      this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-lg', scrollable: true });
      this.fApi.ARTICLE_CATALOG_DETAILS(data._id).subscribe((result)=> {
        if(result.status) {
          this.catForm = result.data;
          this.catForm.form_type = 'edit';
          this.catForm.seo_details.meta_keyword_list = [];
          if (this.catForm.seo_details.meta_keywords?.length) {
            this.catForm.seo_details.meta_keywords.forEach(obj => {
              this.catForm.seo_details.meta_keyword_list.push({ display: obj, value: obj });
            });
          }
          this.popupLoader = false;
        }
        else console.log("response", result);
      });
    }
  }

  onSubmit() {
    this.catForm.errorMsg = '';
    this.catForm.submit = true;
    this.catForm.seo_status = true;
    this.catForm.seo_details.meta_keywords = [];
    if (this.catForm.seo_details?.meta_keyword_list) {
      this.catForm.seo_details.meta_keyword_list.forEach(obj => {
        this.catForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    if (this.catForm.form_type == 'add') {
      this.fApi.ADD_ARTICLE_CATALOG(this.catForm).subscribe(result => {
        this.catForm.submit = false;
        if (result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.fApi.UPDATE_ARTICLE_CATALOG(this.catForm).subscribe(result => {
        this.catForm.submit = false;
        if (result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.catForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.catForm.submit = true;
    this.fApi.DELETE_ARTICLE_CATALOG(this.catForm).subscribe(result => {
      this.catForm.submit = false;
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.catForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onChangeTitle() {
    if (this.catForm.form_type == 'add') {
      this.catForm.seo_details.page_url = this.commonService.urlFormat(this.catForm.name);
      let tempName = this.catForm.name.substring(0, 70);
      this.catForm.seo_details.h1_tag = tempName;
      this.catForm.seo_details.page_title = 'Buy ' + tempName;
    }
  }
  onChangeDesc() {
    if (this.catForm.form_type == 'add') this.catForm.seo_details.meta_desc = this.commonService.stripHtml(this.catForm.description).substring(0, 320);
  }

  ngOnDestroy() {
    this.commonService.page_attr = { page: this.page, search_bar: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
  }
}
