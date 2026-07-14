import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-modify-home-layout',
  templateUrl: './modify-home-layout.component.html',
  styleUrls: ['./modify-home-layout.component.scss']
})

export class ModifyHomeLayoutComponent implements OnInit {

  layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: "Top Left", value: "t_l" }, { name: "Top Center", value: "t_c" }, { name: "Top Right", value: "t_r" },
    { name: "Middle Left", value: "m_l" }, { name: "Middle Center", value: "m_c" }, { name: "Middle Right", value: "m_r" },
    { name: "Bottom Left", value: "b_l" }, { name: "Bottom Center", value: "b_c" }, { name: "Bottom Right", value: "b_r" }
  ];
  grid_details: any = {}; shopping_assist_config: any;
  fileList: FormData; fileLimitInKB: number = 5000; videoLimitInKB: number = 5120;
  maxImgCount: number = 10;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService, public commonService: CommonService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setup/layouts/home";
      this.commonService.secondary_header = " ";
      this.pageLoader = true; this.btnLoader = false; this.params = params
      // layout details
      this.api.LAYOUT_DETAILS(this.params.layout_id, false).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.layoutDetails = result.data;
          if(this.layoutDetails.type=="highlights") this.maxImgCount = 30;
          else if(this.layoutDetails.type=="amenities") this.maxImgCount = 50;
          else if(this.layoutDetails.type=="icon_card_grid") this.maxImgCount = 50;
          else if(this.layoutDetails.type=="feature_list") this.maxImgCount = 50;
          else if(this.layoutDetails.type=="featured_cards") this.maxImgCount = 10;
          else if(this.layoutDetails.type=="cta") this.maxImgCount = 1;
          this.commonService.secondary_header = this.layoutDetails.name;
          if(this.layoutDetails.type=='section') {
            this.grid_details = this.commonService.grid_list.find(obj => obj.type==this.layoutDetails.section_grid_type);
            if(this.grid_details) {
              if(!this.layoutDetails.image_list.length) {
                for(let i=1; i<=this.grid_details.resolutions.length; i++) this.layoutDetails.image_list.push({ rank: i, productList: [] });
              }
            }
            else this.layoutDetails.image_list.push({ rank: 1, productList: [] });
            this.layoutDetails.image_list.forEach(img => {
              if(!Array.isArray(img.btn_list)) img.btn_list = [];
              if(!img.content_details) img.content_details = {};
              img.content_details.option_list = this.normalizeSectionOptionList(img.content_details.option_list);
            });
          }
          else if(this.layoutDetails.type=='secondary') {
            if(!this.layoutDetails.text_list) this.layoutDetails.text_list = [];
            if(!this.layoutDetails.image_list?.length) {
              this.layoutDetails.image_list = [{ rank: 1, content_details: {}, productList: [] }];
            }
          }
          else if(this.layoutDetails.type=='content_grid' && !this.layoutDetails.text_list.length) {
            this.layoutDetails.text_list.push({});
          }
          else if(this.layoutDetails.type=='testimonial') {
            this.layoutDetails.image_list.forEach(el => {
              if(!el.content_details) el.content_details = {};
              if(el.content_details.review_star === undefined || el.content_details.review_star === null) el.content_details.review_star = null;
            });
            if(!this.layoutDetails.image_list.length) this.layoutDetails.image_list.push({ rank: 1, content_details: { review_star: null }, productList: [] });
          }
          else if(this.layoutDetails.type=='shopping_assistant') {
            this.shopping_assist_config = this.layoutDetails.shopping_assistant_config;
            if(!this.shopping_assist_config.changing_text?.length) this.shopping_assist_config.changing_text = [{ value: ''}];
          }
          else if(this.layoutDetails.type=='video_section' && !this.layoutDetails.video_details) {
            this.layoutDetails.video_details = {};
          }
          else if(this.layoutDetails.type=='multi_categories') {
            if(this.layoutDetails.multicategory_list?.length)
            {
              for(let catData of this.layoutDetails.multicategory_list)
              {
                this.findProducts(catData);
                if(catData.image_list?.length) {
                  for(let x of catData.image_list)
                  {
                    this.findProducts(x);
                  }
                }
              }
            }
            else
              this.layoutDetails.multicategory_list = [{ rank: 1, image_list: [{ rank: 1 }] }];
          }
          else if(this.layoutDetails.type=='hero_cta') {
            if(!this.layoutDetails.image_list?.length) this.layoutDetails.image_list = [{ rank: 1, productList: [] }];
            if(!this.layoutDetails.cover_img) this.layoutDetails.cover_img = '';
            if(!this.layoutDetails.highlighted_text) this.layoutDetails.highlighted_text = '';
            if(!this.layoutDetails.highlighted_color) this.layoutDetails.highlighted_color = '';
            if(!this.layoutDetails.rating_config) {
              this.layoutDetails.rating_config = { rating_status: false, rating_icon: '', rating_value: 0, rating_label: '', rating_sub_text: '' };
            }
            if(!this.layoutDetails.badge_config) {
              this.layoutDetails.badge_config = { badge_status: false, badge_icon: '', badge_value: '', badge_label: '' };
            }
            if(!this.layoutDetails.cta_list?.length) {
              this.layoutDetails.cta_list = [
                { heading: '', description: '', image: '', icon_name: '', btn_status: true, btn_list: [] },
                { heading: '', description: '', image: '', icon_name: '', btn_status: true, btn_list: [] }
              ];
            } else {
              this.layoutDetails.cta_list.forEach(cta => {
                if(!cta.icon_name) cta.icon_name = '';
                if(!cta.image) cta.image = '';
                if(!cta.btn_list) cta.btn_list = [];
              });
            }
          }
          else if(this.layoutDetails.type=='amenities') {
            if(!this.layoutDetails.text_list?.length) {
              this.layoutDetails.text_list = [{ image: '', icon_name: '', name: '', description: '' }];
            }
          }
          else if(this.layoutDetails.type=='icon_card_grid') {
            if(!this.layoutDetails.icon_card_list?.length) {
              this.layoutDetails.icon_card_list = [this.getDefaultIconCardItem()];
            }
            this.layoutDetails.icon_card_list = this.normalizeIconCardList(this.layoutDetails.icon_card_list);
          }
          else if(this.layoutDetails.type=='featured_cards') {
            if(!this.layoutDetails.featured_cards_list?.length) {
              // backward-compatible: if old fields exist, wrap them as a single group
              const legacyGroup = {
                heading: this.layoutDetails.heading || '',
                sub_heading: this.layoutDetails.sub_heading || '',
                description: this.layoutDetails.description || '',
                cover_img: this.layoutDetails.cover_img || '',
                cover_img_position: 'left',
                image_list: this.layoutDetails.image_list?.length ? this.layoutDetails.image_list : [{ rank: 1 }],
                features: [this.getDefaultFeaturedCardsFeature()],
                cta_list: this.layoutDetails.cta_list?.length ? this.layoutDetails.cta_list : [{ btn_status: false, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }]
              };
              this.layoutDetails.featured_cards_list = [legacyGroup];
            }
            this.layoutDetails.featured_cards_list.forEach((g) => {
              if (g.cover_img_position !== 'right') {
                g.cover_img_position = 'left';
              }
              if (!Array.isArray(g.features) || !g.features.length) {
                g.features = [this.getDefaultFeaturedCardsFeature()];
              } else {
                g.features = g.features.map((f) => ({
                  ...this.getDefaultFeaturedCardsFeature(),
                  ...f
                }));
              }
            });
          }
          else if(this.layoutDetails.type=='internal_links') {
            this.layoutDetails.group_list = this.normalizeInternalLinkGroups(this.layoutDetails.group_list, this.layoutDetails.cta_list);
            if(!this.layoutDetails.group_list.length) {
              this.layoutDetails.group_list = [this.getDefaultInternalLinkGroup()];
            }
          }
          else if(this.layoutDetails.type=='dual_map') {
            if(!this.layoutDetails.map_list?.length) {
              this.layoutDetails.map_list = [this.getDefaultDualMapItem(), this.getDefaultDualMapItem()];
            }
            else {
              this.layoutDetails.map_list = this.normalizeDualMapList(this.layoutDetails.map_list);
            }
          }
          else if(this.layoutDetails.type=='store_locator') {
            if(!this.layoutDetails.store_locator_config) {
              this.layoutDetails.store_locator_config = { store_image: '', address: '', map_iframe_url: '' };
            }
          }
          else if(this.layoutDetails.type=='feature_split') {
            this.layoutDetails.feature_split_config = this.normalizeFeatureSplitConfig(this.layoutDetails.feature_split_config);
          }
          else if(this.layoutDetails.type=='feature_list') {
            if(!this.layoutDetails.feature_list?.length) {
              this.layoutDetails.feature_list = [this.getDefaultFeatureListItem()];
            }
            this.layoutDetails.feature_list = this.normalizeFeatureListItems(this.layoutDetails.feature_list);
          }
          else if(this.layoutDetails.type=='cta') {
            if(!this.layoutDetails.image_list?.length) {
              this.layoutDetails.image_list = [{ rank: 1, points_list: [], productList: [] }];
            }
            if(!this.layoutDetails.cta_list?.length) {
              this.layoutDetails.cta_list = [{
                heading: '',
                sub_heading: '',
                description: '',
                btn_status: false,
                btn_text: '',
                btn_style: 'primary',
                btn_text_color: 'light',
                btn_link_type: 'internal',
                btn_link: ''
              }];
            }
          }
          else if(!this.layoutDetails.image_list.length && this.layoutDetails.type!='video_section' && this.layoutDetails.type!='content_grid' && this.layoutDetails.type!='feature_list' && this.layoutDetails.type!='amenities' && this.layoutDetails.type!='icon_card_grid' && this.layoutDetails.type!='internal_links' && this.layoutDetails.type!='dual_map' && this.layoutDetails.type!='store_locator' && this.layoutDetails.type!='feature_split') {
            if(this.layoutDetails.type=='multiple_highlighted_section') this.layoutDetails.image_list.push({ rank: 1, content_status: true, content_details: {}, productList: [] });
            else this.layoutDetails.image_list.push({ rank: 1, points_list: [], productList: [] });
          }
          // find product
          if(this.layoutDetails.image_list?.length) {
            for(let x of this.layoutDetails.image_list)
            {
              this.findProducts(x);
            }
          }
          if(this.layoutDetails.points_list?.length) {
            for(let x of this.layoutDetails.points_list)
            {
              this.findProducts(x);
            }
          }
        }
        else {
          console.log("response", result);
          this.router.navigateByUrl("/setup/layouts/home");
        }
      });
    });
  }

  findProducts(x) {
    x.productList = [];
    if(x.link_status && x.link_type=='product' && x.product_id) {
      this.api.PRODUCT_DETAILS(x.product_id).subscribe(result => {
        if(result.status) x.productList = [result.data];
        else console.log("response", result);
      });
    }
  }

  searchProduct(catId, searchTerm, i) {
		this.layoutDetails.image_list[i].productList = [];
    this.layoutDetails.image_list[i].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.layoutDetails.image_list[i].productList = result.list;
				else console.log("response", result);
        this.layoutDetails.image_list[i].searchLoader = false;
			});
		}
	}
  searchProductForLook(catId, searchTerm, i, j) {
    this.layoutDetails.image_list[i].points_list[j].productList = [];
    this.layoutDetails.image_list[i].points_list[j].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.layoutDetails.image_list[i].points_list[j].productList = result.list;
				else console.log("response", result);
        this.layoutDetails.image_list[i].points_list[j].searchLoader = false;
			});
		}
	}
  searchProductForMultiCat(catId, searchTerm, i, j) {
    this.layoutDetails.multicategory_list[i].image_list[j].productList = [];
    this.layoutDetails.multicategory_list[i].image_list[j].searchLoader = true;
		if(catId && searchTerm.length>=3) {
			this.api.PRODUCT_LIST({ category_id: catId, search: searchTerm }).subscribe(result => {
				if(result.status) this.layoutDetails.multicategory_list[i].image_list[j].productList = result.list;
				else console.log("response", result);
        this.layoutDetails.multicategory_list[i].image_list[j].searchLoader = false;
			});
		}
	}

  addNewImg() {
    if(this.layoutDetails.type=='testimonial') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_details: { review_star: null } });
    }
    else if(this.layoutDetails.type=='multiple_highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_status: true, content_details: {} });
    }
    else if(this.layoutDetails.type=='content_grid') {
      this.layoutDetails.text_list.push({});
    }
    else if(this.layoutDetails.type=='feature_list') {
      this.addFeatureItem();
    }
    else if(this.layoutDetails.type=='dual_map') {
      this.layoutDetails.map_list.push(this.getDefaultDualMapItem());
    }
    else if(this.layoutDetails.type=='hero_cta') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, productList: [] });
    }
    else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, points_list: [] });
    }
  }

  addSectionButton(img) {
    if(!Array.isArray(img.btn_list)) img.btn_list = [];
    img.btn_list.push({ btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' });
  }

  getDefaultSectionOption() {
    return { name: '' };
  }

  normalizeSectionOptionList(list: any[] = []) {
    return (Array.isArray(list) ? list : []).map(item => ({
      ...this.getDefaultSectionOption(),
      ...item
    }));
  }

  addSectionOption(img) {
    if(!img.content_details) img.content_details = {};
    if(!Array.isArray(img.content_details.option_list)) img.content_details.option_list = [];
    img.content_details.option_list.push(this.getDefaultSectionOption());
  }

  async onUpdateLayout() {
    this.btnLoader = true;
    let layoutData = structuredClone(this.layoutDetails);
    this.fileList = new FormData();
    if(layoutData.type=='shopping_assistant') {
      layoutData.shopping_assistant_config = {};
      for(let key in this.shopping_assist_config) {
        if(key!='image' && key!='temp_image' && this.shopping_assist_config.hasOwnProperty(key))
          layoutData.shopping_assistant_config[key] = this.shopping_assist_config[key];
      }
      if(this.shopping_assist_config.img_change) this.fileList.append('attachments', this.shopping_assist_config.image);
      else layoutData.shopping_assistant_config.image = this.shopping_assist_config.image;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='video_section') {
      layoutData.video_details = {};
      for(let key in this.layoutDetails.video_details) {
        if(this.layoutDetails.video_details.hasOwnProperty(key) && key!='thumbnail' && key!='src' && key!='temp_image' && key!='temp_video')
          layoutData.video_details[key] = this.layoutDetails.video_details[key];
      }
      if(this.layoutDetails.video_details.video_change) this.fileList.append('video', this.layoutDetails.video_details.src);
      else layoutData.video_details.src = this.layoutDetails.video_details.src;
      if(this.layoutDetails.video_details.img_change) this.fileList.append('thumbnail', this.layoutDetails.video_details.thumbnail);
      else layoutData.video_details.thumbnail = this.layoutDetails.video_details.thumbnail;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='store_locator') {
      let srcConfig = this.layoutDetails.store_locator_config;
      let slConfig: any = {
        address: srcConfig.address || '',
        map_iframe_url: srcConfig.map_iframe_url || ''
      };
      if(srcConfig.img_change) {
        this.fileList.append('attachments', srcConfig.store_image, 'store_img');
        slConfig.img_change = true;
      }
      else {
        slConfig.store_image = srcConfig.store_image || '';
      }
      layoutData.store_locator_config = slConfig;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='feature_split') {
      layoutData.feature_split_config = this.prepareFeatureSplitConfigForSave(this.layoutDetails.feature_split_config);
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='feature_list') {
      this.onSetFormData(layoutData.feature_list).then((ftList) => {
        layoutData.feature_list = ftList;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
    else if(layoutData.type=='hero_cta') {
      if(this.layoutDetails.cover_img_change) {
        this.fileList.append('attachments', this.layoutDetails.cover_img, 'fc_cover');
        layoutData.cover_img_change = true;
      }
      else {
        layoutData.cover_img_change = false;
      }
      // handle CTA card images
      if(layoutData.cta_list?.length) {
        layoutData.cta_list = layoutData.cta_list.map((cta, ci) => {
          let ctaData = Object.assign({}, cta);
          delete ctaData.temp_image;
          if(cta.img_change) {
            delete ctaData.image;
            this.fileList.append('attachments', this.layoutDetails.cta_list[ci].image, 'cta_'+ci+'_img');
          }
          return ctaData;
        });
      }
      this.onSetFormData(layoutData.image_list).then((imgList) => {
        layoutData.image_list = imgList;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
    else if(layoutData.type=='content_grid' || layoutData.type=='amenities') {
      this.onSetFormData(layoutData.text_list).then((imgList) => {
        layoutData.text_list = imgList;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
    else if(layoutData.type=='icon_card_grid') {
      layoutData.icon_card_list = this.normalizeIconCardList(layoutData.icon_card_list);
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='multi_categories') {
      await Promise.all(
        layoutData.multicategory_list.map(async (catData, i) => {
          catData.image_list = await this.onSetFormData2(i, catData.image_list);
        })
      );
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else {
      if(layoutData.type=='featured_cards') {
        layoutData.cover_img_change = false;
        layoutData.cover_img = '';
        layoutData.image_list = [];
        layoutData.cta_list = [];

        if(!Array.isArray(layoutData.featured_cards_list)) layoutData.featured_cards_list = [];
        layoutData.featured_cards_list = layoutData.featured_cards_list.map((group, gi) => {
          const inputGroup = Object.assign({}, group);
          delete inputGroup.temp_cover_img;
          if(inputGroup.cover_img_change && inputGroup.cover_img) {
            this.fileList.append('attachments', inputGroup.cover_img, `fc_${gi}_cover`);
          }
          const groupImages = (Array.isArray(inputGroup.image_list) ? inputGroup.image_list : []).map((img, ii) => {
            const x = Object.assign({}, img);
            delete x.temp_desktop_img; delete x.temp_mobile_img;
            if(img.desktop_img_change) {
              delete x.desktop_img;
              this.fileList.append('attachments', img['desktop_img'], `fc_${gi}_${ii}_d`);
            }
            if(img.mobile_img_change) {
              delete x.mobile_img;
              this.fileList.append('attachments', img['mobile_img'], `fc_${gi}_${ii}_m`);
            }
            return x;
          });
          return {
            heading: inputGroup.heading || '',
            sub_heading: inputGroup.sub_heading || '',
            description: inputGroup.description || '',
            cover_img: inputGroup.cover_img || '',
            cover_img_position: inputGroup.cover_img_position === 'right' ? 'right' : 'left',
            cover_img_change: !!inputGroup.cover_img_change,
            image_list: groupImages,
            features: Array.isArray(inputGroup.features) ? inputGroup.features : [],
            cta_list: Array.isArray(inputGroup.cta_list) ? inputGroup.cta_list : []
          };
        });
      }
      if(layoutData.type=='internal_links') {
        layoutData.group_list = this.normalizeInternalLinkGroups(layoutData.group_list, layoutData.cta_list);
        delete layoutData.cta_list;
      }
      if(layoutData.type=='dual_map') {
        layoutData.map_list = this.prepareDualMapListForSave(this.layoutDetails.map_list);
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
        return;
      }
      this.onSetFormData(layoutData.image_list).then((imgList) => {
        layoutData.image_list = imgList;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
  }

  addFeaturedCardsGroup() {
    if(!Array.isArray(this.layoutDetails.featured_cards_list)) this.layoutDetails.featured_cards_list = [];
    this.layoutDetails.featured_cards_list.push({
      heading: '',
      sub_heading: '',
      description: '',
      cover_img: '',
      cover_img_position: 'left',
      image_list: [],
      features: [this.getDefaultFeaturedCardsFeature()],
      cta_list: [{ btn_status: false, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }]
    });
  }

  getDefaultFeaturedCardsFeature() {
    return { icon_name: '', name: '', detail: '' };
  }

  normalizeFeatureCards(features: any[] = []) {
    return (Array.isArray(features) ? features : []).map(item => ({
      ...this.getDefaultFeaturedCardsFeature(),
      ...item
    }));
  }

  getDefaultFeatureListItem() {
    return {
      image: '',
      img_badge_icon: '',
      img_badge_text: '',
      heading: '',
      sub_heading: '',
      description: '',
      features: [this.getDefaultFeaturedCardsFeature()],
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      notes: ''
    };
  }

  normalizeFeatureListItems(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map(item => ({
      ...this.getDefaultFeatureListItem(),
      ...item,
      features: this.normalizeFeatureCards(item?.features)
    }));
  }

  addFeatureItem() {
    if(!Array.isArray(this.layoutDetails.feature_list)) this.layoutDetails.feature_list = [];
    this.layoutDetails.feature_list.push(this.getDefaultFeatureListItem());
  }

  getDefaultIconCardItem(rank = 1) {
    return {
      rank,
      icon_name: '',
      heading: '',
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

  normalizeIconCardList(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultIconCardItem(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  addIconCardItem() {
    if(!Array.isArray(this.layoutDetails.icon_card_list)) this.layoutDetails.icon_card_list = [];
    this.layoutDetails.icon_card_list.push(this.getDefaultIconCardItem(this.layoutDetails.icon_card_list.length + 1));
  }

  addFeaturedCardsFeature(groupIndex: number) {
    const g = this.layoutDetails.featured_cards_list?.[groupIndex];
    if (!g) return;
    if (!Array.isArray(g.features)) g.features = [];
    g.features.push(this.getDefaultFeaturedCardsFeature());
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

  addInternalLinkGroup() {
    this.layoutDetails.group_list.push(this.getDefaultInternalLinkGroup());
    this.syncInternalLinkGroupRanks();
  }

  removeInternalLinkGroup(groupIndex) {
    this.layoutDetails.group_list.splice(groupIndex, 1);
    this.syncInternalLinkGroupRanks();
  }

  addInternalLinkItem(groupIndex) {
    this.layoutDetails.group_list[groupIndex].link_list.push(this.getDefaultInternalLinkItem());
  }

  onInternalLinkGroupRankChange(changedIndex: number) {
    if(!Array.isArray(this.layoutDetails.group_list) || changedIndex < 0 || changedIndex >= this.layoutDetails.group_list.length) {
      return;
    }

    const total = this.layoutDetails.group_list.length;
    let newRank = Number(this.layoutDetails.group_list[changedIndex]?.rank);
    if(!Number.isFinite(newRank) || newRank < 1) newRank = 1;
    if(newRank > total) newRank = total;

    const [movedGroup] = this.layoutDetails.group_list.splice(changedIndex, 1);
    this.layoutDetails.group_list.splice(newRank - 1, 0, movedGroup);
    this.syncInternalLinkGroupRanks();
  }

  syncInternalLinkGroupRanks() {
    if(!Array.isArray(this.layoutDetails.group_list)) {
      this.layoutDetails.group_list = [];
      return;
    }
    this.layoutDetails.group_list = this.layoutDetails.group_list.map((group, index) => ({
      ...group,
      rank: index + 1
    }));
  }

  getDefaultFeatureSplitItem() {
    return { icon_name: '', name: '', detail: '' };
  }

  getDefaultFeatureSplitConfig() {
    return {
      cover_img: '',
      img_alt: '',
      quote_text: '',
      quote_author: '',
      features: [this.getDefaultFeatureSplitItem()]
    };
  }

  normalizeFeatureSplitConfig(config: any = {}) {
    return {
      ...this.getDefaultFeatureSplitConfig(),
      ...config,
      features: (Array.isArray(config?.features) && config.features.length)
        ? config.features.map((feature) => ({ ...this.getDefaultFeatureSplitItem(), ...feature }))
        : [this.getDefaultFeatureSplitItem()]
    };
  }

  prepareFeatureSplitConfigForSave(config: any = {}) {
    const fsConfig: any = {
      img_alt: config?.img_alt || '',
      quote_text: config?.quote_text || '',
      quote_author: config?.quote_author || '',
      features: (Array.isArray(config?.features) ? config.features : []).map((feature) => ({
        icon_name: feature?.icon_name || '',
        name: feature?.name || '',
        detail: feature?.detail || ''
      }))
    };
    delete fsConfig.temp_cover_img;
    if(config?.img_change && config?.cover_img) {
      delete fsConfig.cover_img;
      fsConfig.img_change = true;
      this.fileList.append('attachments', config.cover_img, 'fs_cover_img');
    }
    else {
      fsConfig.cover_img = config?.cover_img || '';
    }
    return fsConfig;
  }

  addFeatureSplitItem() {
    if(!this.layoutDetails.feature_split_config) {
      this.layoutDetails.feature_split_config = this.getDefaultFeatureSplitConfig();
    }
    if(!Array.isArray(this.layoutDetails.feature_split_config.features)) {
      this.layoutDetails.feature_split_config.features = [];
    }
    this.layoutDetails.feature_split_config.features.push(this.getDefaultFeatureSplitItem());
  }

  featureSplitFileChangeListener(event) {
    if(!this.layoutDetails.feature_split_config) {
      this.layoutDetails.feature_split_config = this.getDefaultFeatureSplitConfig();
    }
    delete this.layoutDetails.feature_split_config.cover_img_err;
    if(event.target.files && event.target.files[0]) {
      const inFile = event.target.files[0];
      if(['image/jpeg', 'image/png', 'image/gif', 'image/webp'].indexOf(inFile.type) != -1) {
        const reader = new FileReader();
        const fileData = event.target.files[0];
        const fileInKB = Math.round(fileData.size / 1024);
        reader.onload = (e: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
            this.layoutDetails.feature_split_config.temp_cover_img = (<FileReader>e.target).result;
            this.layoutDetails.feature_split_config.cover_img = fileData;
            this.layoutDetails.feature_split_config.img_change = true;
          }
          else this.layoutDetails.feature_split_config.cover_img_err = true;
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  getDefaultMapFeature() {
    return { icon_name: '', name: '' };
  }

  getDefaultDualMapItem() {
    return {
      rank: 1,
      image: '',
      img_alt: '',
      heading: '',
      sub_heading: '',
      description: '',
      features: [this.getDefaultMapFeature()],
      address: '',
      btn_link_type: 'internal',
      btn_status: true,
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_text: '',
      btn_icon_name: '',
      btn_link: '',
      iframe_url: ''
    };
  }

  normalizeDualMapList(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultDualMapItem(),
      ...item,
      rank: item?.rank || index + 1,
      features: (Array.isArray(item?.features) && item.features.length)
        ? item.features.map((feature) => ({ ...this.getDefaultMapFeature(), ...feature }))
        : [this.getDefaultMapFeature()],
      btn_status: typeof item?.btn_status === 'boolean'
        ? item.btn_status
        : item?.btn_status !== 'false'
    }));
  }

  prepareDualMapListForSave(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, mi) => {
      const mapData: any = {
        rank: item?.rank || mi + 1,
        img_alt: item?.img_alt || '',
        heading: item?.heading || '',
        sub_heading: item?.sub_heading || '',
        description: item?.description || '',
        features: (Array.isArray(item?.features) ? item.features : []).map((feature) => ({
          icon_name: feature?.icon_name || '',
          name: feature?.name || ''
        })),
        address: item?.address || '',
        iframe_url: item?.iframe_url || '',
        btn_link_type: item?.btn_link_type || 'internal',
        btn_status: typeof item?.btn_status === 'boolean'
          ? item.btn_status
          : item?.btn_status !== 'false',
        btn_style: item?.btn_style || 'primary',
        btn_text_color: item?.btn_text_color || 'light',
        btn_text: item?.btn_text || '',
        btn_icon_name: item?.btn_icon_name || '',
        btn_link: item?.btn_link || ''
      };
      delete mapData.temp_image;
      if(item?.img_change && item?.image) {
        delete mapData.image;
        mapData.img_change = true;
        this.fileList.append('attachments', item.image, `dm_${mi}_img`);
      }
      else {
        mapData.image = item?.image || '';
      }
      return mapData;
    });
  }

  addDualMapFeature(mapIndex) {
    const mapItem = this.layoutDetails.map_list?.[mapIndex];
    if(!mapItem) return;
    if(!Array.isArray(mapItem.features)) mapItem.features = [];
    mapItem.features.push(this.getDefaultMapFeature());
  }

  dualMapFileChangeListener(mapIndex, event) {
    const mapItem = this.layoutDetails.map_list?.[mapIndex];
    if(!mapItem) return;
    delete mapItem.err_msg;
    if(event.target.files && event.target.files[0]) {
      const inFile = event.target.files[0];
      if(['image/jpeg', 'image/png', 'image/gif', 'image/webp'].indexOf(inFile.type) != -1) {
        const reader = new FileReader();
        const fileData = event.target.files[0];
        const fileInKB = Math.round(fileData.size / 1024);
        reader.onload = (e: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
            mapItem.temp_image = (<FileReader>e.target).result;
            mapItem.image = fileData;
            mapItem.img_change = true;
          }
          else mapItem.err_msg = true;
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  addFeaturedCardsImage(groupIndex) {
    if(!this.layoutDetails.featured_cards_list?.[groupIndex]) return;
    if(!Array.isArray(this.layoutDetails.featured_cards_list[groupIndex].image_list)) {
      this.layoutDetails.featured_cards_list[groupIndex].image_list = [];
    }
    this.layoutDetails.featured_cards_list[groupIndex].image_list.push({ rank: this.layoutDetails.featured_cards_list[groupIndex].image_list.length + 1 });
  }

  onFeaturedCardsCoverChange(groupIndex, event) {
    if(!this.layoutDetails.featured_cards_list?.[groupIndex]) return;
    delete this.layoutDetails.featured_cards_list[groupIndex].cover_img_err;
    if(event.target.files && event.target.files[0]) {
      const fileData = event.target.files[0];
      const fileInKB = Math.round(fileData.size / 1024);
      if(["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(fileData.type) != -1) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
            this.layoutDetails.featured_cards_list[groupIndex].temp_cover_img = (<FileReader>e.target).result;
            this.layoutDetails.featured_cards_list[groupIndex].cover_img = fileData;
            this.layoutDetails.featured_cards_list[groupIndex].cover_img_change = true;
          }
          else this.layoutDetails.featured_cards_list[groupIndex].cover_img_err = true;
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  onFeaturedCardsImageChange(groupIndex, imgIndex, devType, event) {
    const group = this.layoutDetails.featured_cards_list?.[groupIndex];
    if(!group?.image_list?.[imgIndex]) return;
    delete group.image_list[imgIndex]?.d_err_msg;
    delete group.image_list[imgIndex]?.m_err_msg;
    if(event.target.files && event.target.files[0]) {
      const fileData = event.target.files[0];
      const fileInKB = Math.round(fileData.size / 1024);
      if(["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(fileData.type) != -1) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          if(devType=='desktop') {
            if(fileInKB <= this.fileLimitInKB) {
              group.image_list[imgIndex].temp_desktop_img = (<FileReader>e.target).result;
              group.image_list[imgIndex].desktop_img = fileData;
              group.image_list[imgIndex].desktop_img_change = true;
            }
            else group.image_list[imgIndex].d_err_msg = true;
          }
          else {
            if(fileInKB <= this.fileLimitInKB) {
              group.image_list[imgIndex].temp_mobile_img = (<FileReader>e.target).result;
              group.image_list[imgIndex].mobile_img = fileData;
              group.image_list[imgIndex].mobile_img_change = true;
            }
            else group.image_list[imgIndex].m_err_msg = true;
          }
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  callUpdateApi() {
    this.api.UPDATE_LAYOUT_LIST(this.fileList).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate(["/setup/layouts/home"]);
      }
      else {
        this.layoutDetails.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        // image
        delete objData.temp_desktop_img; delete objData.temp_mobile_img;
        if(imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], i+'_d');
        }
        if(imgData.mobile_img_change) {
          delete objData.mobile_img;
          this.fileList.append('attachments', imgData['mobile_img'], i+'_m');
        }
        // video
        delete objData.temp_desktop_video; delete objData.temp_mobile_video;
        if(imgData.desktop_video_change) {
          delete objData.desktop_video;
          this.fileList.append('attachments', imgData['desktop_video'], i+'_dv');
        }
        if(imgData.mobile_video_change) {
          delete objData.mobile_video;
          this.fileList.append('attachments', imgData['mobile_video'], i+'_mv');
        }
        // content
        delete objData.temp_img;
        if(imgData.img_change) {
          delete objData.image;
          this.fileList.append('attachments', imgData['image'], i+'_c');
        }
        updatedList.push(objData)
      }
      resolve(updatedList);
    });
  }
  onSetFormData2(pInd, imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        delete objData.temp_desktop_img;
        if(imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], pInd+'_'+i+'_d');
        }
        updatedList.push(objData)
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(devType, index, event) {
    if(devType=='fc_cover') { delete this.layoutDetails.cover_img_err; }
    else {
      if(this.layoutDetails.image_list?.[index]) { delete this.layoutDetails.image_list[index].d_err_msg; delete this.layoutDetails.image_list[index].m_err_msg; }
      if(this.layoutDetails.text_list?.[index]) { delete this.layoutDetails.text_list[index].c_err_msg; }
      if(this.layoutDetails.feature_list?.[index]) { delete this.layoutDetails.feature_list[index].c_err_msg; }
    }
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/gif"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(devType=='desktop') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_img = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].desktop_img = fileData;
              this.layoutDetails.image_list[index].desktop_img_change = true;
            }
            else this.layoutDetails.image_list[index].d_err_msg = true;
          }
          else if(devType=='mobile') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_img = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].mobile_img = fileData;
              this.layoutDetails.image_list[index].mobile_img_change = true;
            }
            else this.layoutDetails.image_list[index].m_err_msg = true;
          }
          else if(devType=='fc_cover') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.temp_cover_img = (<FileReader>event.target).result;
              this.layoutDetails.cover_img = fileData;
              this.layoutDetails.cover_img_change = true;
            }
            else this.layoutDetails.cover_img_err = true;
          }
          else if(devType=='feature') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.feature_list[index].temp_img = (<FileReader>event.target).result;
              this.layoutDetails.feature_list[index].image = fileData;
              this.layoutDetails.feature_list[index].img_change = true;
            }
            else this.layoutDetails.feature_list[index].c_err_msg = true;
          }
          else {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.text_list[index].temp_img = (<FileReader>event.target).result;
              this.layoutDetails.text_list[index].image = fileData;
              this.layoutDetails.text_list[index].img_change = true;
            }
            else this.layoutDetails.text_list[index].c_err_msg = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }
  multiCatFileChangeListener(pIndex, index, event) {
    delete this.layoutDetails.multicategory_list[pIndex].image_list[index]?.d_err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size/ 1024);
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB<=this.fileLimitInKB) {
            this.layoutDetails.multicategory_list[pIndex].image_list[index].temp_desktop_img = (<FileReader>event.target).result;
            this.layoutDetails.multicategory_list[pIndex].image_list[index].desktop_img = fileData;
            this.layoutDetails.multicategory_list[pIndex].image_list[index].desktop_img_change = true;
          }
          else this.layoutDetails.multicategory_list[pIndex].image_list[index].d_err_msg = true;
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }
  videoChangeListener(devType, index, event) {
    delete this.layoutDetails.image_list[index].d_vid_err_msg;
    delete this.layoutDetails.image_list[index].m_vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      if(["video/mp4", "video/webm"].indexOf(fileData.type) != -1) {
        reader.onload = (event: ProgressEvent) => {
          if(devType=='desktop') {
            if(fileInKB<=this.videoLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_video = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].desktop_video = fileData;
              this.layoutDetails.image_list[index].desktop_video_change = true;
            }
            else this.layoutDetails.image_list[index].d_vid_err_msg = true;
          }
          else {
            if(fileInKB<=this.videoLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_video = (<FileReader>event.target).result;
              this.layoutDetails.image_list[index].mobile_video = fileData;
              this.layoutDetails.image_list[index].mobile_video_change = true;
            }
            else this.layoutDetails.image_list[index].m_vid_err_msg = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  storeLocatorFileChangeListener(event) {
    delete this.layoutDetails.store_locator_config.err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size / 1024);
        reader.onload = (e: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
            this.layoutDetails.store_locator_config.temp_store_image = (<FileReader>e.target).result;
            this.layoutDetails.store_locator_config.store_image = fileData;
            this.layoutDetails.store_locator_config.img_change = true;
          }
          else this.layoutDetails.store_locator_config.err_msg = true;
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

  shopAssistFileChangeListener(event) {
    delete this.shopping_assist_config.err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.fileLimitInKB) {
          this.shopping_assist_config.temp_image = (<FileReader>event.target).result;
          this.shopping_assist_config.image = fileData;
          this.shopping_assist_config.img_change = true;
        }
        else this.shopping_assist_config.err_msg = true;
      }
      reader.readAsDataURL(fileData);
    }
    else console.log("Invaid file");    
    }
  }

  videoSecFileChangeListener(event) {
    delete this.layoutDetails.video_details.img_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      if(["image/jpeg", "image/png"].indexOf(fileData.type) != -1) 
      {
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.fileLimitInKB) {
          this.layoutDetails.video_details.temp_image = (<FileReader>event.target).result;
          this.layoutDetails.video_details.thumbnail = fileData;
          this.layoutDetails.video_details.img_change = true;
        }
        else this.layoutDetails.video_details.img_err_msg = true;
      }
      reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }
  videoFileChangeListener(event) {
    delete this.layoutDetails.video_details.vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.videoLimitInKB) {
          this.layoutDetails.video_details.temp_video = (<FileReader>event.target).result;
          this.layoutDetails.video_details.src = fileData;
          this.layoutDetails.video_details.video_change = true;
        }
        else this.layoutDetails.video_details.vid_err_msg = true;
      }
      reader.readAsDataURL(fileData);
    }
  }

  ctaFileChangeListener(ctaIndex, event) {
    let cta = this.layoutDetails.cta_list[ctaIndex];
    delete cta.img_err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size / 1024);
        reader.onload = (e: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
            cta.temp_image = (<FileReader>e.target).result;
            cta.image = fileData;
            cta.img_change = true;
          }
          else cta.img_err_msg = true;
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

}
