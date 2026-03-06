import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-blog-event',
  templateUrl: './blog-event.component.html',
  styleUrls: ['./blog-event.component.scss']
})

export class BlogEventComponent implements OnInit {

  pageLoader: boolean;
  blogForm: any = {};
  currentDate: Date = new Date();
  imgBaseUrl = environment.img_baseurl;
  categoryList: any = [];
  isAdvanced: boolean;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.isAdvanced = false;
      if(this.router.url.includes('/setting/advanced-blogs/')) {
        this.isAdvanced = true;
      }
      this.commonService.redirect = "/setting/blogs";
      this.commonService.secondary_header = "Add Blog";
      if(this.isAdvanced) {
        this.commonService.redirect = "/setting/advanced-blogs";
        this.commonService.secondary_header = "Add Advanced Blog";
      }
      this.blogForm = { form_type: 'add', created_on: this.currentDate, seo_details: {}, faqs: [], category_id: [] };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Blog";
        if(this.isAdvanced) this.commonService.secondary_header = "Update Advanced Blog";
        this.api.BLOG_DETAILS(params.id).subscribe(result => {
          if(result.status) {
            this.blogForm = result.data;
            this.blogForm.form_type = 'edit';
            this.blogForm.created_on = new Date(this.blogForm.created_on);
            if(!this.blogForm.seo_details) this.blogForm.seo_details = {};
            this.blogForm.seo_details.meta_keyword_list = [];
            if(this.blogForm.seo_details.meta_keywords.length) {
              this.blogForm.seo_details.meta_keywords.forEach(obj => {
                this.blogForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
            if(this.blogForm.faqs.length) this.blogForm.faq_status = true;
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
      this.getCatalog();
    });
  }

  onSubmit() {
    this.blogForm.submit = true;
    this.blogForm.seo_status = true;
    this.blogForm.seo_details.meta_keywords = [];
    if(this.blogForm.seo_details?.meta_keyword_list) {
      this.blogForm.seo_details.meta_keyword_list.forEach(obj => {
        this.blogForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    if(!this.blogForm.faq_status) {
      this.blogForm.faq_title = ''; this.blogForm.faqs = [];
    }
    // category list
    this.blogForm.category_id = []; 
    this.categoryList.forEach(element => {
      if(element.selected) {
        this.blogForm.category_id.push(element._id);
      }
    });
    this.blogForm.type = "basic";
    if(this.isAdvanced) this.blogForm.type = "advanced";
    if(this.blogForm.form_type=='add') {
      this.api.ADD_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  getCatalog() {
    if(this.commonService.blog_catalog_list?.length) {
      this.onSetcatId();
    }
    else {
      this.api.BLOG_CATALOG_LIST().subscribe((result) => {
        if(result.status) {
          this.commonService.blog_catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
          this.commonService.updateLocalData('blog_catalog_list', this.commonService.blog_catalog_list);
          this.onSetcatId();
        }
      })
    }
  }
  onSetcatId() {
    this.categoryList = this.commonService?.blog_catalog_list;
    this.categoryList.forEach(element => {
      element.selected = false;
      if(this.blogForm?.category_id?.length && this.blogForm?.category_id.findIndex(x => x == element._id)!=-1) element.selected = true;
    });
  }
  onChangeTitle() {
    if(this.blogForm.form_type=='add') {
      this.blogForm.seo_details.page_url = this.commonService.urlFormat(this.blogForm.name);
      let tempName = this.blogForm.name.substring(0, 70);
      this.blogForm.seo_details.h1_tag = tempName;
      this.blogForm.seo_details.page_title = 'Blogs - '+tempName;
    }
  }
  onChangeDesc() {
    if(this.blogForm.form_type=='add')
      this.blogForm.seo_details.meta_desc = this.commonService.stripHtml(this.blogForm.description).substring(0, 320);
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.blogForm.image = (<FileReader>event.target).result;
        this.blogForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}