import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SetupService } from '../../../setup.service';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-extra-pages-event',
  templateUrl: './extra-pages-event.component.html',
  styleUrls: ['./extra-pages-event.component.scss'],
  animations: [SharedAnimations],
})

export class ExtraPagesEventComponent implements OnInit {

  params: any; pageLoader: boolean; popupLoader: boolean;
  formData: any = {}; search_bar = '';
  configData: any = environment.config_data; deleteForm: any = {};
  page = 1; pageSize = 10; maxRank: any = 0; addForm: any = {};
  editForm: any = {}; gridList: any = [];
  layoutTypes: any = [
    { name: 'Main Slider', value: 'slider' },
    { name: 'Grid', value: 'grid' },
    { name: 'Featured Sections', value: 'featured_section' },
    { name: 'Highlighted Section', value: 'highlighted_section' },
    { name: 'Multi-Highlighted Section', value: 'multiple_highlighted_section' },
    { name: 'Secondary Banner', value: 'secondary' },
    { name: 'Flexible Segment', value: 'flexible' },
    { name: 'Scrolling Text', value: 'scrolling_text' },
    { name: 'Testimonial', value: 'testimonial' },
    { name: 'Video Section', value: 'video_section' },
    { name: 'Highlights', value: 'highlights' }
  ];
  multiTabOptions: any = [
    { type: 'featured', disp_name: 'Featured' },
    { type: 'new_arrivals', disp_name: 'New Arrivals' },
    { type: 'discounted', disp_name: 'Discounted' },
    { type: 'category', disp_name: 'Catalog' },
  ];

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private api: SetupService, public commonService: CommonService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.commonService.redirect = '/setup/pages/extra-pages';
    this.commonService.secondary_header = '';
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      this.formData = { seo_details: {} };
      if (this.params.id) {
        this.pageLoader = true;
        this.api.EXTRA_PAGE_DETAILS(this.params.id).subscribe((result) => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if (result.status) {
            this.formData = result.data;
            this.commonService.secondary_header = this.formData.name;
            if (!this.formData.seo_details) this.formData.seo_details = {};
            this.formData.seo_details.meta_keyword_list = [];
            if (this.formData.seo_details.meta_keywords.length) {
              this.formData.seo_details.meta_keywords.forEach((obj) => {
                this.formData.seo_details.meta_keyword_list.push({
                  display: obj, value: obj
                });
              });
            }
            this.maxRank = this.formData.segments?.length;
          } else console.log('response', result);
        });
      }
      else this.commonService.secondary_header = 'New Extra page';
    });
  }

  // Content Subit
  onSubmit() {
    this.formData.submit = true;
    this.formData.seo_status = true;
    this.formData.seo_details.meta_keywords = [];
    if(this.formData.seo_details?.meta_keyword_list) {
      this.formData.seo_details.meta_keyword_list.forEach((obj) => {
        this.formData.seo_details.meta_keywords.push(obj.value);
      });
    }
    if(this.params.id) {
      // update
      this.api.UPDATE_EXTRA_PAGE(this.formData).subscribe((result) => {
        this.formData.submit = false;
        if(result.status) this.router.navigate(['/setup/pages/extra-pages']);
        else console.log('response', result);
      });
    } else {
      // add
      this.api.ADD_EXTRA_PAGE(this.formData).subscribe((result) => {
        this.formData.submit = false;
        if(result.status) this.router.navigate(['/setup/pages/extra-pages']);
        else console.log('response', result);
      });
    }
  }

  //Open add modal
  onAddNewSegment(modalName) {
    this.addForm = { rank: this.maxRank + 1, type: '' };
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  //Add segment
  onAdd() {
    this.addForm.submit = true;
    this.addForm.text_list = [];
    if (this.addForm.type == 'scrolling_text') {
      this.addForm.options?.forEach((el) => {
        this.addForm.text_list.push({ name: el.value });
      });
    }
    this.addForm.page_id = this.formData._id;
    this.addForm.store_id = this.commonService.store_details._id;
    this.api.ADD_SEGMENT_EXTRA_PAGE(this.addForm).subscribe((result) => {
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

  //Open edit modal
  onUpdate() {
    this.editForm.submit = true;
    this.editForm.text_list = [];
    if(this.editForm.type=='scrolling_text') {
      this.editForm.options?.forEach(el => {
        this.editForm.text_list.push({ name: el.value });
      });
    }
    this.editForm.page_id = this.formData._id;
    this.editForm.store_id = this.commonService.store_details._id;
		this.api.UPDATE_SEGMENT_EXTRA_PAGE(this.editForm).subscribe(result => {
      this.editForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  //Update segment
  onEditDetails(seg_id, modalName) {
    this.editForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.GET_SEGMENT_EXTRA_PAGE(this.params.id, seg_id).subscribe(result => {
      this.popupLoader = false; 
      if(result.status) {
        this.editForm = result.data;
        this.editForm.options = [];
        this.editForm.prev_rank = this.editForm.rank;
        this.editForm.dup_type = this.findType(this.editForm.type);
        if(this.editForm.type!='grid') delete this.editForm.grid_type;
        if(this.editForm.grid_type)
          this.editForm.dup_grid_type = this.findGridType(this.editForm.grid_type);
        if(this.editForm.type == 'scrolling_text') {
          this.editForm.text_list?.forEach((el) => {
            this.editForm.options.push({ display: el.name, value: el.name });
          });
        }
      } else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  //delete segment
  onDelete() {
    this.deleteForm.btnLoader = true;
    this.deleteForm.page_id = this.formData._id;
    this.api.REMOVE_SEGMENT_EXTRA_PAGE(this.deleteForm).subscribe(result => {
      this.deleteForm.btnLoader = false;
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

  onChangeType(x) {
    if (x == 'grid') {
      this.addForm.grid_list = this.commonService.grid_list;
      this.addForm.grid_type = this.addForm.grid_list[0].type;
    } else {
      this.addForm.grid_list = [];
      this.addForm.grid_type = '';
    }
  }

  findType(type) {
    let index = this.layoutTypes.findIndex((obj) => obj.value == type);
    if (index != -1) return this.layoutTypes[index].name;
    else return '';
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(
      (obj) => obj.type == type
    );
    if (index != -1) return this.commonService.grid_list[index].name;
    else return '';
  }

  onEditSeo(modalName) {
    this.editForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName);
    this.api.EXTRA_PAGE_DETAILS(this.params.id).subscribe((result) => {
      this.popupLoader = false; 
      if(result.status) {
        this.editForm = result.data;
        if(!this.editForm.seo_details) this.editForm.seo_details = {};
        this.editForm.seo_details.meta_keyword_list = [];
        if(this.editForm.seo_details.meta_keywords.length) {
          this.editForm.seo_details.meta_keywords.forEach((obj) => {
            this.editForm.seo_details.meta_keyword_list.push({
              display: obj, value: obj
            });
          });
        }
      }
      else console.log('response', result);
    });
  }
  onUpdateSeo() {
    this.editForm.submit = true;
    let details = {
      _id: this.editForm._id,
      page_url: this.editForm.page_url,
      seo_details: this.editForm.seo_details
    };
    this.api.UPDATE_EXTRA_PAGE(details).subscribe((result) => {
      this.editForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.err_msg = result.message;
        console.log('response', result);
      }
    });
  }
}