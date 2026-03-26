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
  fileLimitInKB = 500;

  layoutTypes: any = [
    { name: 'Secondary Banner', value: 'secondary' },
    { name: 'Testimonial', value: 'testimonial' },
    { name: 'Highlighted Section', value: 'highlighted_section' },
    { name: 'Section Grid', value: 'section' },
    { name: 'FAQ', value: 'faq' }
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
            this.maxRank = this.formData.segments?.length || 0;
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
        if (result.status) { this.saveSuccess = true; setTimeout(() => { this.saveSuccess = false; }, 3000); }
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

  fileChangeListener(event) {
    if (event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      if (['image/jpeg', 'image/png', 'image/webp'].indexOf(fileData.type) !== -1) {
        let reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          this.formData.temp_image = (<FileReader>e.target).result;
          this.formData.image = (<FileReader>e.target).result;
          this.formData.img_change = true;
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

  onEditDetails(seg_id, modalName) {
    this.editForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.GET_SEGMENT_CATALOG_PAGE(this.params.id, seg_id).subscribe(result => {
      this.popupLoader = false;
      if (result.status) {
        this.editForm = result.data;
        this.editForm.prev_rank = this.editForm.rank;
        this.editForm.dup_type = this.findTypeName(this.editForm.type);
        if (!this.editForm.faq_list) this.editForm.faq_list = [];
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

  addFaqItem(form) {
    if (!form.faq_list) form.faq_list = [];
    form.faq_list.push({ ques: '', answer: '', rank: form.faq_list.length + 1 });
  }

  removeFaqItem(form, index) {
    form.faq_list.splice(index, 1);
    form.faq_list.forEach((item, i) => { item.rank = i + 1; });
  }

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
    if (type === 'faq' && !form.faq_list) form.faq_list = [];
  }

}
