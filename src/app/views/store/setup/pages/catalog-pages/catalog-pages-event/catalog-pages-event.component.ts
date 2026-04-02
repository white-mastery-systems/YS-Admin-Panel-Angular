import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SetupService } from '../../../setup.service';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-catalog-pages-event',
  templateUrl: './catalog-pages-event.component.html',
  styleUrls: ['./catalog-pages-event.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogPagesEventComponent implements OnInit {

  params: any; pageLoader: boolean; popupLoader: boolean;
  formData: any = { seo_details: {} };
  search_bar = ''; deleteForm: any = {};
  page = 1; pageSize = 10; maxRank = 0;
  addForm: any = {}; editForm: any = {};
  saveSuccess: boolean;
  imgBaseUrl = environment.img_baseurl;
  configData: any = environment.config_data;
  fileLimitInKB = 500;
  gridList: any = [];

  layoutTypes: any = [
    { name: 'Slider', value: 'slider' },
    { name: 'Secondary Banner', value: 'secondary' },
    { name: 'Testimonial', value: 'testimonial' },
    { name: 'Highlighted Section', value: 'highlighted_section' },
    { name: 'Section Grid', value: 'section' },
    { name: 'Featured Cards', value: 'featured_cards' },
    { name: 'Amenities', value: 'amenities' },
    { name: 'FAQ', value: 'faq' },
    { name: 'Content Section', value: 'content_section' },
    { name: 'CTA', value: 'cta' },
    { name: 'Interactive Map', value: 'interactive_map' },
    { name: 'Route Map', value: 'route_map' },
    { name: 'Hero CTA', value: 'hero_cta' },
    { name: 'Feature List', value: 'feature_list' }
  ];

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private api: SetupService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.commonService.redirect = '/setup/pages/catalog-pages';
    this.commonService.secondary_header = '';
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      this.formData = { seo_details: {} };
      if (this.params.id) {
        this.pageLoader = true;
        this.api.CATALOG_PAGE_DETAILS(this.params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if (result.status) {
            this.formData = result.data;
            this.commonService.secondary_header = this.formData.name;
            if (!this.formData.seo_details) this.formData.seo_details = {};
            this.formData.seo_details.meta_keyword_list = [];
            if (this.formData.seo_details.meta_keywords?.length) {
              this.formData.seo_details.meta_keywords.forEach(obj => {
                this.formData.seo_details.meta_keyword_list.push({ display: obj, value: obj });
              });
            }
            if (!this.formData.profile_details) this.formData.profile_details = {};
            if (!this.formData.social_media_links) this.formData.social_media_links = [];
            if (this.formData.social_media_links.length) this.formData.social_media_status = true;
            this.maxRank = this.formData.segments?.length || 0;
            
            if (this.commonService.ys_features.indexOf('blogs') !== -1 && this.layoutTypes.findIndex(obj => obj.value === 'blogs') === -1)
              this.layoutTypes.push({ name: 'Blogs', value: 'blogs' });

          } else console.log('response', result);
        });
      } else {
        this.commonService.secondary_header = 'New Catalog Page';
      }
    });
  }

  // ── Static fields submit ──────────────────────────────────────────────────

  onSubmit() {
    this.formData.submit = true;
    this.formData.seo_details.meta_keywords = [];
    this.formData.seo_details.meta_keyword_list?.forEach(obj => {
      this.formData.seo_details.meta_keywords.push(obj.value);
    });
    
    const payload = Object.assign({}, this.formData);
    delete payload.segments;

    if (this.params.id) {
      this.api.UPDATE_CATALOG_PAGE(payload).subscribe(result => {
        this.formData.submit = false;
        if (result.status) { this.router.navigate(['/setup/pages/catalog-pages']); }
        else console.log('response', result);
      });
    } else {
      this.api.ADD_CATALOG_PAGE(payload).subscribe(result => {
        this.formData.submit = false;
        if (result.status) this.router.navigate(['/setup/pages/catalog-pages/modify/' + result.data._id]);
        else { this.formData.err_msg = result.message; console.log('response', result); }
      });
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────────

  fileChangeListener(type, event) {
    if (event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      if (['image/jpeg', 'image/png', 'image/webp'].indexOf(fileData.type) !== -1) {
        let reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          if (type === 'profile') {
            this.formData.profile_details.image = (<FileReader>e.target).result;
            this.formData.p_img_change = true;
          }
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  onChangeTitle() {
    this.formData.page_url = this.commonService.urlFormat(this.formData.name);
    let tempName = this.formData.name.substring(0, 70);
    if (!this.formData.seo_details) this.formData.seo_details = {};
    this.formData.seo_details.h1_tag = tempName;
    this.formData.seo_details.page_title = tempName;
  }

  // ── Segment add ───────────────────────────────────────────────────────────

  onAddNewSegment(modalName) {
    this.addForm = { rank: this.maxRank + 1, type: '', faq_list: [] };
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  onAdd() {
    this.addForm.submit = true;
    this.addForm.page_id = this.formData._id;
    this.addForm.store_id = this.commonService.store_details._id;
    this.api.ADD_SEGMENT_CATALOG_PAGE(this.addForm).subscribe(result => {
      this.addForm.submit = false;
      if (result.status) {
        document.getElementById('closeAddModal').click();
        this.ngOnInit();
      } else {
        this.addForm.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

  // ── Segment edit ──────────────────────────────────────────────────────────
  // segment details for update
  onEditDetails(seg_id, modalName) {
    this.editForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName, { size: 'lg', centered: true });
    this.api.GET_SEGMENT_CATALOG_PAGE(this.params.id, seg_id).subscribe((result) => {
      this.popupLoader = false;
      if (result.status) {
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
        this.editForm.dup_type = this.findTypeName(this.editForm.type);
        if(this.editForm.type=='blogs') this.gridList = this.commonService.blog_grid_list;
        if (!this.editForm.faq_list) this.editForm.faq_list = [];
        if (!this.editForm.feature_list) this.editForm.feature_list = [];
        if (this.editForm.type === 'section')
          this.editForm.dup_grid_type = this.findGridType(this.editForm.section_grid_type);
      } else {
        this.editForm.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

  onUpdate() {
    this.editForm.submit = true;
    this.editForm.page_id = this.formData._id;
    this.editForm.store_id = this.commonService.store_details._id;
    this.api.UPDATE_SEGMENT_CATALOG_PAGE(this.editForm).subscribe(result => {
      this.editForm.submit = false;
      if (result.status) {
        document.getElementById('closeEditModal').click();
        this.ngOnInit();
      } else {
        this.editForm.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

  // ── Segment delete ────────────────────────────────────────────────────────

  onDelete() {
    this.deleteForm.btnLoader = true;
    this.deleteForm.page_id = this.formData._id;
    this.api.REMOVE_SEGMENT_CATALOG_PAGE(this.deleteForm).subscribe(result => {
      this.deleteForm.btnLoader = false;
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      } else {
        this.deleteForm.errorMsg = result.message;
        console.log('response', result);
      }
    });
  }

  // ── FAQ helpers ───────────────────────────────────────────────────────────



  // ── Utilities ─────────────────────────────────────────────────────────────

  findTypeName(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value === type);
    return index !== -1 ? this.layoutTypes[index].name : '';
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(obj => obj.type === type);
    return index !== -1 ? this.commonService.grid_list[index].name : '';
  }

  onChangeSegmentType(type, form) {
    delete form.section_grid_type;
    form.grid_list = [];
    if (type === 'section') {
      form.grid_list = this.commonService.grid_list;
      form.section_grid_type = form.grid_list[0].type;
    }

    if (type === 'amenities' && (!form.text_list || !form.text_list.length)) {
      form.text_list = [{ image: '', name: '', description: '' }];
    }

    if (type === 'feature_list' && (!form.feature_list || !form.feature_list.length)) {
      form.feature_list = [{ image: '', heading: '', sub_heading: '' }];
    }

    if (type === 'faq' && (!form.faq_list || !form.faq_list.length)) {
      form.faq_list = [{ ques: '', answer: '', rank: 1 }];
    }

    if (type === 'blogs') {
      this.gridList = this.commonService.blog_grid_list;
      form.blogs_type = 'grid';
      form.section_grid_type = this.gridList[0].type;
    }

    if (type === 'interactive_map') {
      if (!form.map_list || !form.map_list.length) {
        form.map_list = [{ category: '', iframe_url: '' }];
      }
    }

    if (type === 'featured_cards') {
      if (!form.image_list?.length) {
        form.image_list = [{ rank: 1 }];
      }
      if (!form.cta_list?.length) {
        form.cta_list = [{ btn_status: false, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }];
      }
    }

    if (type === 'hero_cta') {
      form.btn_status = false;
      form.btn_style = 'primary';
      form.btn_text_color = 'light';
      form.btn_link_type = 'internal';
      if (!form.cta_list?.length) {
        form.cta_list = [
          { heading: '', description: '', btn_status: true, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' },
          { heading: '', description: '', btn_status: true, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }
        ];
      }
    }
  }

}
