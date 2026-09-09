import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-article-event',
    templateUrl: './article-event.component.html',
    styleUrls: ['./article-event.component.scss'],
    standalone: false
})
export class ArticleEventComponent {

  pageLoader: boolean;
  articleForm: any = {};
  currentDate: Date = new Date();
  imgBaseUrl = environment.img_baseurl;
  categoryList: any = []; productList: any = [];

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setting/articles";
      this.commonService.secondary_header = "Add Article";
      this.articleForm = { form_type: 'add', created_on: this.currentDate, seo_details: {}, faqs: [], category_id: [] };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Article";
        this.api.ARTICLE_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.articleForm = result.data;
            this.articleForm.form_type = 'edit';
            this.articleForm.created_on = new Date(this.articleForm.created_on);
            if(!this.articleForm.seo_details) this.articleForm.seo_details = {};
            this.articleForm.seo_details.meta_keyword_list = [];
            if(this.articleForm.seo_details.meta_keywords.length) {
              this.articleForm.seo_details.meta_keywords.forEach(obj => {
                this.articleForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
            if(this.articleForm.faqs.length) this.articleForm.faq_status = true;
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      this.getCatalog();
    });
  }

  onSubmit() {
    this.articleForm.submit = true;
    this.articleForm.seo_status = true;
    this.articleForm.seo_details.meta_keywords = [];
    if(this.articleForm.seo_details?.meta_keyword_list) {
      this.articleForm.seo_details.meta_keyword_list.forEach(obj => {
        this.articleForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    if(!this.articleForm.faq_status) {
      this.articleForm.faq_title = ''; this.articleForm.faqs = [];
    }
    // category list
    this.articleForm.category_id = []; 
    this.categoryList.forEach(element => {
      if(element.selected) {
        this.articleForm.category_id.push(element._id);
      }
    });
    if(this.articleForm.form_type=='add') {
      this.api.ADD_ARTICLE(this.articleForm).subscribe(result => {
        this.articleForm.submit = false;
        if(result.status) this.router.navigate(['/setting/articles']);
        else {
          this.articleForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_ARTICLE(this.articleForm).subscribe(result => {
        this.articleForm.submit = false;
        if(result.status) this.router.navigate(['/setting/articles']);
        else {
          this.articleForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  getCatalog() {
    if(this.commonService.article_catalog_list?.length) {
      this.onSetcatId();
    }
    else {
      this.api.ARTICLE_CATALOG_LIST().subscribe((result) => {
        if(result.status) {
          this.commonService.article_catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
          this.commonService.updateLocalData('article_catalog_list', this.commonService.article_catalog_list);
          this.onSetcatId();
        }
      })
    }
  }
  onSetcatId() {
    this.categoryList = this.commonService?.article_catalog_list;
    this.categoryList.forEach(element => {
      element.selected = false;
      if(this.articleForm?.category_id?.length && this.articleForm?.category_id.findIndex(x => x == element._id)!=-1) element.selected = true;
    });
  }
  onChangeTitle() {
    if(this.articleForm.form_type=='add') {
      this.articleForm.seo_details.page_url = this.commonService.urlFormat(this.articleForm.name);
      let tempName = this.articleForm.name.substring(0, 70);
      this.articleForm.seo_details.h1_tag = tempName;
      this.articleForm.seo_details.page_title = 'Articles - '+tempName;
    }
  }
  onChangeDesc() {
    if(this.articleForm.form_type=='add')
      this.articleForm.seo_details.meta_desc = this.commonService.stripHtml(this.articleForm.description).substring(0, 320);
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.articleForm.image = (<FileReader>event.target).result;
        this.articleForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}
