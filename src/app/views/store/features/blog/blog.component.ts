import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  animations: [SharedAnimations]
})
export class BlogComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  blogForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  seoForm: any = {}; popupLoader: boolean;
  isAdvanced: boolean;
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private storeApi: StoreApiService, private router: Router
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  open_website()
  {
    let url = '/blogs';
    if(this.commonService.selected_blog_catalog?.seo_details?.page_url) {
      url = '/blogs/'+this.commonService.selected_blog_catalog.seo_details.page_url;
    }
    window.open(this.commonService.store_details?.base_url+url);
  }

  ngOnInit() {
    this.isAdvanced = false;
    if(this.router.url=='/setting/advanced-blogs') {
      this.isAdvanced = true;
    }
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Blogs";
      if(this.isAdvanced) this.commonService.secondary_header = "Advanced Blogs";
    }
    this.pageLoader = true;
    let catId = null, type = 'basic';
    if(this.commonService.selected_blog_catalog?._id) catId = this.commonService.selected_blog_catalog._id;
    if(this.isAdvanced) type = 'advanced';
    this.api.BLOG_LIST(catId, type).subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd() {
    if(this.isAdvanced) {
      this.router.navigate(['/setting/advanced-blogs/add']);
    }
    else this.router.navigate(['/setting/blogs/add']);
  }
  onView(x) {
    if(this.isAdvanced) {
      this.router.navigate(['/setting/advanced-blogs/'+x._id]);
    }
    else this.router.navigate(['/setting/blogs/'+x._id]);
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.blogForm = x;
    this.blogForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.api.UPDATE_BLOG({ _id: this.blogForm._id, status: this.blogForm.change_status+"d" }).subscribe(result => {
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
    this.api.DELETE_BLOG(this.deleteForm).subscribe(result => {
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
        if(result.data.blog_seo) {
          this.seoForm = result.data.blog_seo;
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
    this.storeApi.UPDATE_STORE_PROPERTY_DETAILS({ blog_seo: this.seoForm }).subscribe(result => {
      if(result.status) document.getElementById('closeModal').click();
      else {
        this.seoForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  ngOnDestroy() {
    delete this.commonService.selected_blog_catalog;
  }

}