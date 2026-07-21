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
  importLoader: boolean;
  importError: string;
  importEditorType: string = 'basic';
  importFile: File = null;
  importFileName: string = '';
  readonly blogDocMaxBytes = 10 * 1024 * 1024;

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
    let catId = null, type = null;
    if(this.commonService.selected_blog_catalog?._id) catId = this.commonService.selected_blog_catalog._id;
    if(this.isAdvanced) type = 'advanced';
    this.api.BLOG_LIST(catId, type, null, 'enabled').subscribe(result => {
      if(result.status) {
        this.list = (result.list || []).map((item) => ({
          ...item,
          image: this.normalizeAssetPath(item.image),
          thumbnail: this.normalizeAssetPath(item.thumbnail),
          coverImage: this.normalizeAssetPath(item.coverImage)
        }));
      }
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
    else this.router.navigate(['/setting/blogs/'+(x.slug || x._id)]);
  }

  // Feature A — import a .docx/.md and create a blog draft, then open it for review.
  openImportDialog(modalName) {
    this.importFile = null;
    this.importFileName = '';
    this.importError = '';
    this.importLoader = false;
    this.importEditorType = this.importEditorType || 'basic';
    this.modalService.open(modalName, { centered: true });
  }

  onImportFileSelect(event) {
    const file = event?.target?.files?.[0];
    if(event?.target) event.target.value = '';
    if(!file) return;
    const lowerName = file.name.toLowerCase();
    const allowed = ['.docx', '.md', '.markdown', '.txt'];
    if(!allowed.some((ext) => lowerName.endsWith(ext))) {
      this.importError = 'Please select a .docx or .md file';
      this.importFile = null;
      this.importFileName = '';
      return;
    }
    if(file.size > this.blogDocMaxBytes) {
      this.importError = `Document is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`;
      this.importFile = null;
      this.importFileName = '';
      return;
    }
    this.importError = '';
    this.importFile = file;
    this.importFileName = file.name;
  }

  submitImport(modal) {
    if(!this.importFile) { this.importError = 'Please choose a file'; return; }
    this.importError = '';
    this.importLoader = true;
    const formData = new FormData();
    formData.append('file', this.importFile);
    formData.append('editor_type', this.importEditorType || 'basic');
    this.api.IMPORT_BLOG_DOC(formData).subscribe(result => {
      this.importLoader = false;
      if(result.status) {
        if(modal) modal.close();
        this.router.navigate(['/setting/blogs/'+(result.slug || result.blog_id)]);
      }
      else {
        this.importError = result.message || 'Unable to import document';
        console.log("import", result);
      }
    }, () => {
      this.importLoader = false;
      this.importError = 'Unable to import document';
    });
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.blogForm = x;
    this.blogForm.change_status = status;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    let reqData: any = { _id: this.blogForm._id, status: this.blogForm.change_status+"d" };
    if(!this.isAdvanced && this.isAdvancedEditorType(this.blogForm.editor_type)) {
      reqData = {
        editor_type: 'advanced',
        slug: this.blogForm.slug,
        title: this.blogForm.name,
        eyebrow_heading: this.blogForm.eyebrow_heading || '',
        author_id: this.blogForm.author_id,
        author: this.blogForm.author,
        createdOn: this.blogForm.created_on,
        coverImage: this.blogForm.coverImage || this.blogForm.image,
        thumbnail: this.blogForm.thumbnail || '',
        imageAlt: this.blogForm.imageAlt || this.blogForm.img_alt,
        authorAvatar: this.blogForm.authorAvatar,
        authorRole: this.blogForm.authorRole,
        authorBio: this.blogForm.authorBio,
        authorLink: this.blogForm.authorLink,
        readTime: this.blogForm.readTime,
        tags: this.blogForm.tags || [],
        published: this.blogForm.change_status=='enable',
        content: this.blogForm.content,
        seo_details: this.blogForm.seo_details,
        faq_title: this.blogForm.faq_title,
        faqs: this.blogForm.faqs
      };
    }
    else if(!this.isAdvanced) {
      reqData = {
        ...this.blogForm,
        status: this.blogForm.change_status+"d",
        published: this.blogForm.change_status=='enable'
      };
    }
    this.api.UPDATE_BLOG(reqData).subscribe(result => {
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
    let reqData = this.deleteForm;
    if(!this.isAdvanced) reqData = { slug: this.deleteForm.slug };
    this.api.DELETE_BLOG(reqData).subscribe(result => {
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

  toAbsoluteAssetUrl(value: string) {
    const input = (value || '').trim();
    if(!input) return '';
    if(/^https?:\/\//i.test(input) || /^data:/i.test(input)) return input;
    const base = (this.imgBaseUrl || '').replace(/\/+$/, '');
    const path = input.replace(/^\/+/, '');
    return base ? `${base}/${path}` : `/${path}`;
  }

  private normalizeAssetPath(value: string) {
    const input = (value || '').trim();
    if(!input) return '';
    if(/^data:/i.test(input)) return input;
    if(/^https?:\/\//i.test(input)) {
      const match = input.match(/\/uploads\/.+$/i);
      return match ? match[0] : input;
    }
    if(input.startsWith('uploads/')) return `/${input}`;
    return input;
  }

  private isAdvancedEditorType(editorType: string) {
    return editorType === 'advanced' || editorType === 'editorjs';
  }

}
