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
    { name: "Main Slider", value: "slider" },
    { name: "Hero CTA", value: "hero_cta" },
    { name: "FAQ", value: "faq" },
    { name: "Internal Links", value: "internal_links" },
    { name: "Dual Map", value: "dual_map" },
    { name: "Amenities", value: "amenities" },
    { name: "Feature List", value: "feature_list" },
    { name: "Section Grid", value: "section" },
    { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Highlighted Section", value: "highlighted_section" },
    { name: "Multi-Highlighted Section", value: "multiple_highlighted_section" },
    { name: "Multi-Tab Featured Products", value: "multiple_featured_product" },
    { name: "Secondary Banner", value: "secondary" },
    { name: "Flexible Segment", value: "flexible" },
    { name: "Scrolling Text", value: "scrolling_text" },
    { name: "Social Video", value: "social_video" },
    { name: "Content Grid", value: "content_grid" },
    { name: "Content Section", value: "content_section" },
    { name: "Icon Card Grid", value: "icon_card_grid" },
    { name: "Contact Info", value: "contact_info" },
    { name: "CTA", value: "cta" }
  ];
  multiTabOptions: any = [
    { type: "featured", disp_name: "Featured" },
    { type: "new_arrivals", disp_name: "New Arrivals" },
    { type: "discounted", disp_name: "Discounted" },
    { type: "category", disp_name: "Catalog" }
  ];
  themeColorExists: boolean;

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal,
    private activeRoute: ActivatedRoute, private api: SetupService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    if(this.commonService.deploy_details.theme_colors && this.commonService.deploy_details.theme_colors.primary)
      this.themeColorExists = true;
    if(this.commonService.ys_features.indexOf('testimonials') !== -1)
      this.layoutTypes.push({ name: "Testimonial", value: "testimonial" });
    if(this.commonService.ys_features.indexOf('shopping_assistant') !== -1)
      this.layoutTypes.push({ name: "Shopping Assistant", value: "shopping_assistant" });
    if(this.commonService.ys_features.indexOf('blogs') !== -1)
      this.layoutTypes.push({ name: "Blogs", value: "blogs" });
    if(this.commonService.ys_features.indexOf('shop_the_look') !== -1)
      this.layoutTypes.push({ name: "Shop the Look", value: "shop_the_look" });
    if(this.commonService.store_details?.package_info?.category!='genie') {
      this.layoutTypes.push({ name: "Video Section", value: "video_section" });
      this.layoutTypes.push({ name: "Highlights", value: "highlights" });
      this.layoutTypes.push({ name: "Instagram", value: "instagram" });
    }
    if(this.commonService.store_details?._id==environment.config_data.chettinad_id)
      this.layoutTypes.push({ name: "Multi-Grid Featured Sections", value: "multi_grid_featured_section" });
    if(this.commonService.store_details?._id==environment.config_data.surgical_id)
      this.layoutTypes.push({ name: "Featured Sections with Products", value: "featured_section_product" });
    if(this.commonService.store_details?._id==environment.config_data.tulsi_madras_id)
      this.layoutTypes.push({ name: "Live2ai Segment", value: "live2ai" });
    if(this.commonService.store_details?._id==environment.config_data.oneafrica)
      this.layoutTypes.push({ name: "Multi Categories", value: "multi_categories" });
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
    if(!this.commonService.deploy_stages.logo)
      this.commonService.openDeployAlertModal('logo', 'Please add logo for your business before adding a new segment');
    else if(!this.themeColorExists)
      this.commonService.openDeployAlertModal('color', 'Please set colors for your website before adding a new segment');
    else if(this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else {
      this.addForm = { layout_list: [{}], rank: this.maxRank+1, type: '', is_margin: true };
      this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
    }
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
    if(this.addForm.type!="multiple_featured_product") delete this.addForm.multitab_list;
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
    const updatePayload = { ...this.editForm };
    // Content fields for internal_links are edited in segment image view only.
    if (updatePayload.type === 'internal_links') {
      delete updatePayload.group_list;
      delete updatePayload.cta_list;
      delete updatePayload.heading;
      delete updatePayload.sub_heading;
      delete updatePayload.description;
    }
		this.api.UPDATE_SEGMENT_EXTRA_PAGE(updatePayload).subscribe(result => {
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
        if(this.editForm.is_margin === undefined) this.editForm.is_margin = true;
        if(this.editForm.type == 'amenities' && !this.editForm.text_list?.length) {
          this.editForm.text_list = [this.getDefaultAmenityItem()];
        }
        if(this.editForm.type == 'faq' && !this.editForm.faq_list?.length) {
          this.editForm.faq_list = [this.getDefaultFaqItem()];
        }
        if(this.editForm.type == 'internal_links') {
          this.editForm.group_list = this.normalizeInternalLinkGroups(this.editForm.group_list, this.editForm.cta_list);
          if(!this.editForm.group_list.length) {
            this.editForm.group_list = [this.getDefaultInternalLinkGroup()];
          }
        }
        if(this.editForm.type == 'dual_map' && !this.editForm.map_list?.length) {
          this.editForm.map_list = [this.getDefaultDualMapItem(), this.getDefaultDualMapItem()];
        }
        if(this.editForm.type == 'feature_list' && !this.editForm.feature_list?.length) {
          this.editForm.feature_list = [this.getDefaultFeatureListItem()];
        }
        if(this.editForm.type == 'icon_card_grid' && !this.editForm.icon_card_list?.length) {
          this.editForm.icon_card_list = [this.getDefaultIconCardItem()];
        }
        if(this.editForm.type == 'contact_info' && !this.editForm.contact_info_list?.length) {
          this.editForm.contact_info_list = [this.getDefaultContactInfoItem()];
        }
        if(this.editForm.type == 'cta' && !this.editForm.cta_list?.length) {
          this.editForm.cta_list = [this.getDefaultCtaItem()];
        }
        if(this.editForm.type!='section' && this.editForm.type!='multi_grid_featured_section')
          delete this.editForm.section_grid_type;
        if(this.editForm.section_grid_type)
          this.editForm.dup_grid_type = this.findGridType(this.editForm.section_grid_type);
        if(this.editForm.type=='instagram') this.gridList = this.commonService.insta_grid_list;
        else if(this.editForm.type=='blogs') this.gridList = this.commonService.blog_grid_list;
        else if (this.editForm.type == 'scrolling_text') {
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
    this.addForm.grid_list = []; this.gridList = [];
    delete this.addForm.section_grid_type;
    this.addForm.multitab_list = [{}];
    if(x=='amenities' && !this.addForm.text_list?.length) {
      this.addForm.text_list = [this.getDefaultAmenityItem()];
    }
    if(x=='faq' && !this.addForm.faq_list?.length) {
      this.addForm.faq_list = [this.getDefaultFaqItem()];
    }
    if(x=='internal_links' && !this.addForm.group_list?.length) {
      this.addForm.group_list = [this.getDefaultInternalLinkGroup()];
    }
    if(x=='dual_map' && !this.addForm.map_list?.length) {
      this.addForm.map_list = [this.getDefaultDualMapItem(), this.getDefaultDualMapItem()];
    }
    if(x=='feature_list' && !this.addForm.feature_list?.length) {
      this.addForm.feature_list = [this.getDefaultFeatureListItem()];
    }
    if(x=='icon_card_grid' && !this.addForm.icon_card_list?.length) {
      this.addForm.icon_card_list = [this.getDefaultIconCardItem()];
    }
    if(x=='contact_info' && !this.addForm.contact_info_list?.length) {
      this.addForm.contact_info_list = [this.getDefaultContactInfoItem()];
    }
    if(x=='cta' && !this.addForm.cta_list?.length) {
      this.addForm.cta_list = [this.getDefaultCtaItem()];
    }
    if(x=='section') {
      this.addForm.grid_list = this.commonService.grid_list;
      this.addForm.section_grid_type = this.addForm.grid_list[0].type;
    }
    else if(x=='multi_grid_featured_section') {
      this.addForm.grid_list = this.commonService.multi_grid_list;
      this.addForm.section_grid_type = this.addForm.grid_list[0].type;
      this.addForm.grid_count = this.addForm.grid_list[0].count;
    }
    else if(x=='instagram') {
      this.addForm.insta_config = {};
      this.gridList = this.commonService.insta_grid_list;
      this.addForm.blogs_type = 'grid';
      this.addForm.section_grid_type = this.gridList[0].type;
    }
    else if(x=='blogs') {
      this.gridList = this.commonService.blog_grid_list;
      this.addForm.blogs_type = 'grid';
      this.addForm.section_grid_type = this.gridList[0].type;
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

  getDefaultContactInfoItem() {
    return {
      icon_name: '',
      heading: '',
      description: '',
      btn_status: true,
      btn_link_type: 'external',
      btn_link: ''
    };
  }

  getDefaultIconCardItem(rank = 1) {
    return {
      rank,
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      active_status: true
    };
  }

  getDefaultHeroCtaItem() {
    return {
      heading: '',
      description: '',
      btn_status: true,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  getDefaultCtaItem() {
    return {
      heading: '',
      sub_heading: '',
      description: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  getDefaultAmenityItem() {
    return {
      image: '',
      icon_name: '',
      name: '',
      description: ''
    };
  }

  getDefaultFaqItem() {
    return {
      ques: '',
      answer: '',
      rank: 1
    };
  }

  getDefaultInternalLinkItem() {
    return {
      btn_status: true,
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_text: '',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  getDefaultInternalLinkGroup() {
    return {
      rank: 1,
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      link_list: [this.getDefaultInternalLinkItem()]
    };
  }

  normalizeInternalLinkGroups(groupList: any[] = [], ctaList: any[] = []) {
    const sourceGroups = groupList?.length ? groupList : (ctaList?.length ? [{
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      link_list: ctaList
    }] : []);

    return sourceGroups.map(group => ({
      rank: Number(group?.rank) > 0 ? Number(group.rank) : 1,
      icon_name: group?.icon_name || '',
      heading: group?.heading || '',
      sub_heading: group?.sub_heading || '',
      description: group?.description || '',
      link_list: (group?.link_list?.length ? group.link_list : [this.getDefaultInternalLinkItem()]).map(item => ({
        ...this.getDefaultInternalLinkItem(),
        ...item
      }))
    })).sort((a, b) => a.rank - b.rank)
      .map((group, index) => ({
        ...group,
        rank: index + 1
      }));
  }

  getDefaultDualMapItem() {
    return {
      heading: '',
      address: '',
      btn_link_type: 'internal',
      btn_status: true,
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_text: '',
      btn_link: '',
      iframe_url: ''
    };
  }

  getDefaultFeatureListItem() {
    return {
      image: '',
      heading: '',
      sub_heading: '',
      description: '',
      features: [{ icon_name: '', name: '', detail: '' }],
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
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
