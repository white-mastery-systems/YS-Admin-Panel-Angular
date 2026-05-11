import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
  animations: [SharedAnimations]
})

export class HomeLayoutComponent implements OnInit {

  page = 1; pageSize = 10; popupLoader: boolean;
  pageLoader: boolean; search_bar: string;
  list: any = []; maxRank: any = 0;
  addForm: any = {}; editForm: any = {}; deleteForm: any = {};
  layoutTypes: any = [
    { name: "Primary Slider", value: "primary_slider" },
    { name: "Main Slider", value: "slider" },
    { name: "Hero CTA", value: "hero_cta" },
    { name: "Section Grid", value: "section" },
    { name: "Featured Sections", value: "featured_section" },
    { name: "Featured Products", value: "featured_product" },
    { name: "Amenities", value: "amenities" },
    { name: "Featured Cards", value: "featured_cards" },
    { name: "CTA", value: "cta" },
    { name: "Dual Map", value: "dual_map" },
    { name: "FAQ", value: "faq" },
    { name: "Internal Links", value: "internal_links" },
    { name: "Highlighted Section", value: "highlighted_section" },
    { name: "Multi-Highlighted Section", value: "multiple_highlighted_section" },
    { name: "Multi-Tab Featured Products", value: "multiple_featured_product" },
    { name: "Secondary Banner", value: "secondary" },
    { name: "Flexible Segment", value: "flexible" },
    { name: "Scrolling Text", value: "scrolling_text" },
    { name: "Social Video", value: "social_video" },
    { name: "Content Grid", value: "content_grid" }
  ];
  multiTabOptions: any = [
    { type: "featured", disp_name: "Featured" },
    { type: "new_arrivals", disp_name: "New Arrivals" },
    { type: "discounted", disp_name: "Discounted" },
    { type: "category", disp_name: "Catalog" }
  ];
  themeColorExists: boolean; configData: any = environment.config_data;
  gridList: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: StoreApiService, public commonService: CommonService
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

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      if(this.commonService.previous_route.indexOf("/layouts/home")==-1 && this.commonService.previous_route!='/') {
        sessionStorage.setItem("lpr", this.commonService.previous_route);
      }
      this.commonService.redirect = "/setup";
      if(sessionStorage.getItem("lpr")) this.commonService.redirect = sessionStorage.getItem("lpr");
      this.commonService.secondary_header = "Home Layouts";
    }
    this.pageLoader = true;
    this.api.LAYOUT_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
        // this.list = result.list.filter(el => el.type=='highlights');
        // result.list.forEach(obj => {
        //   if(obj.type!='highlights') this.list.push(obj);
        // });
        this.maxRank = this.list.length;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAddNewSegment(modalName) {
    if(!this.commonService.deploy_stages.logo)
      this.commonService.openDeployAlertModal('logo', 'Please add logo for your business before adding a new segment');
    else if(!this.themeColorExists)
      this.commonService.openDeployAlertModal('color', 'Please set colors for your website before adding a new segment');
    else if(this.commonService.store_details?.package_details?.package_id==environment.config_data.free_package_id)
      document.getElementById("openCommonUpgradeModal").click();
    else {
      this.addForm = { layout_list: [{}], rank: this.maxRank+1, is_margin: true, bg_color: '' };
      this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    }
  }

  onAdd() {
    this.addForm.submit = true;
    if(this.addForm.type!="multiple_featured_product") delete this.addForm.multitab_list;
    this.addForm.text_list = [];
    if(this.addForm.type=='scrolling_text') {
      this.addForm.options?.forEach(el => {
        this.addForm.text_list.push({ name: el.value });
      });
    }
    this.api.ADD_LAYOUT(this.addForm).subscribe(result => {
      this.addForm.submit = false;
			if(result.status) {
				document.getElementById('closeAddModal').click();
				this.ngOnInit();
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

  // EDIT
  onEditDetails(x, modalName) {
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.popupLoader = true;
    this.api.LAYOUT_DETAILS(x._id, false).subscribe(result => {
			if(result.status) {
        this.popupLoader = false;
        this.editForm = result.data;
        this.editForm.options = [];
        this.editForm.prev_rank = this.editForm.rank;
        if(this.editForm.is_margin === undefined) this.editForm.is_margin = true;
        if(!this.editForm.bg_color) this.editForm.bg_color = '';
        this.editForm.dup_type = this.findType(this.editForm.type);
        if(this.editForm.type!='section' && this.editForm.type!='multi_grid_featured_section')
          delete this.editForm.section_grid_type;
        if(this.editForm.section_grid_type)
          this.editForm.dup_grid_type = this.findGridType(this.editForm.section_grid_type);
        if(this.editForm.type=='instagram') this.gridList = this.commonService.insta_grid_list;
        else if(this.editForm.type=='blogs') this.gridList = this.commonService.blog_grid_list;
        else if(this.editForm.type=='scrolling_text') {
          this.editForm.text_list?.forEach(el => {
            this.editForm.options.push({ display: el.name, value: el.name });
          });
        }
        else if(this.editForm.type=='faq' && !this.editForm.faq_list?.length) {
          this.editForm.faq_list = [{ ques: '', answer: '', rank: 1 }];
        }
        else if(this.editForm.type=='dual_map' && !this.editForm.map_list?.length) {
          this.editForm.map_list = [{ iframe_url: '' }];
        }
        else if(this.editForm.type=='internal_links') {
          this.editForm.group_list = this.normalizeInternalLinkGroups(this.editForm.group_list, this.editForm.cta_list);
          if(!this.editForm.group_list.length) this.editForm.group_list = [this.getDefaultInternalLinkGroup()];
        }
			}
			else console.log("response", result);
		});
  }

  // UPDATE
	onUpdate() {
    this.editForm.submit = true;
    this.editForm.text_list = [];
    if(this.editForm.type=='scrolling_text') {
      this.editForm.options?.forEach(el => {
        this.editForm.text_list.push({ name: el.value });
      });
    }
		this.api.UPDATE_LAYOUT(this.editForm).subscribe(result => {
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

  // DELETE
  onDelete() {
    this.deleteForm.btnLoader = true;
    this.api.DELETE_LAYOUT(this.deleteForm).subscribe(result => {
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

  onResetLayout(modalName) {
    if(!this.commonService.deploy_stages.logo)
      this.commonService.openDeployAlertModal('logo', 'Please add logo for your business before adding a new segment');
    else if(!this.themeColorExists)
      this.commonService.openDeployAlertModal('color', 'Please set colors for your website before adding a new segment');
    else {
      this.deleteForm = {};
      if(modalName) this.modalService.open(modalName, { centered: true });
      else {
        this.deleteForm.btnLoader = true;
        this.api.RESET_LAYOUT().subscribe(result => {
          this.deleteForm.btnLoader = false;
          if(result.status) {
            if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
            this.ngOnInit();
          }
          else {
            this.deleteForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
    }
  }

  findType(type) {
    let index = this.layoutTypes.findIndex(obj => obj.value==type);
    if(index!=-1) return this.layoutTypes[index].name;
    else return "";
  }

  findGridType(type) {
    let index = this.commonService.grid_list.findIndex(obj => obj.type==type);
    if(index!=-1) return this.commonService.grid_list[index].name;
    else return "";
  }

  onChangeType(x) {
    this.addForm.grid_list = []; this.gridList = [];
    delete this.addForm.section_grid_type;
    this.addForm.multitab_list = [{}];
    if(x=='hero_cta') {
      this.addForm.btn_status = false;
      this.addForm.btn_text = '';
      this.addForm.btn_style = 'primary';
      this.addForm.btn_text_color = 'light';
      this.addForm.btn_link_type = 'internal';
      this.addForm.btn_link = '';
    }
    else if(x=='amenities') {
      this.addForm.text_list = [{ image: '', icon_name: '', name: '', description: '' }];
    }
    else if(x=='featured_cards') {
      this.addForm.cta_list = [{ btn_status: false, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }];
    }
    else if(x=='faq') {
      this.addForm.faq_list = [{ ques: '', answer: '', rank: 1 }];
    }
    else if(x=='dual_map') {
      this.addForm.map_list = [{ iframe_url: '' }];
    }
    else if(x=='internal_links') {
      this.addForm.group_list = [this.getDefaultInternalLinkGroup()];
    }
    else if(x=='featured_product') {
      this.addForm.btn_status = true;
      this.addForm.btn_text = 'View All';
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
    }
    else if(x=='blogs') this.gridList = this.commonService.blog_grid_list;
  }

  open_website() {
    window.open(this.commonService.store_details?.base_url);
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
      heading: '',
      sub_heading: '',
      description: '',
      link_list: [this.getDefaultInternalLinkItem()]
    };
  }

  normalizeInternalLinkGroups(groupList: any[] = [], ctaList: any[] = []) {
    const sourceGroups = groupList?.length ? groupList : (ctaList?.length ? [{
      heading: '',
      sub_heading: '',
      description: '',
      link_list: ctaList
    }] : []);

    return sourceGroups.map(group => ({
      rank: Number(group?.rank) > 0 ? Number(group.rank) : 1,
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

  getInternalLinksCount(segment) {
    if(segment?.group_list?.length) {
      return segment.group_list.reduce((count, group) => count + (group?.link_list?.length || 0), 0);
    }
    return segment?.cta_list?.length || 0;
  }

}
