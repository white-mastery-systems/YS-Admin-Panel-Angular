import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StoreApiService } from '../../../../../../services/store-api.service';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from '../../../../../../../environments/environment';
import { SetupService } from '../../../setup.service';

@Component({
  selector: 'app-extra-page-image',
  templateUrl: './extra-page-image.component.html',
  styleUrls: ['./extra-page-image.component.scss']
})

export class ExtraPageImageComponent implements OnInit {

  productList: any = []; layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: "Top Left", value: "t_l" }, { name: "Top Center", value: "t_c" }, { name: "Top Right", value: "t_r" },
    { name: "Middle Left", value: "m_l" }, { name: "Middle Center", value: "m_c" }, { name: "Middle Right", value: "m_r" },
    { name: "Bottom Left", value: "b_l" }, { name: "Bottom Center", value: "b_c" }, { name: "Bottom Right", value: "b_r" }
  ];
  grid_details: any = {}; shopping_assist_config: any;
  fileList: FormData; fileLimitInKB: number = 500; videoLimitInKB: number = 5120;
  maxImgCount: number = 10;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: StoreApiService, public commonService: CommonService,
    public setup: SetupService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setup/pages/extra-pages/modify/"+params.id;
      this.commonService.secondary_header = " ";
      this.pageLoader = true; this.btnLoader = false; this.params = params
      // layout details
      this.setup.GET_SEGMENT_EXTRA_PAGE(this.params.id,this.params.seg_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.layoutDetails = result.data;
          if(this.layoutDetails.type=="highlights") this.maxImgCount = 30;
          else if(this.layoutDetails.type=="amenities") this.maxImgCount = 50;
          else if(this.layoutDetails.type=="faq") this.maxImgCount = 20;
          this.commonService.secondary_header = this.layoutDetails.name;
          if(this.layoutDetails.type=='section') {
            this.grid_details = this.commonService.grid_list.find(obj => obj.type==this.layoutDetails.section_grid_type);
            if(this.grid_details) {
              if(!this.layoutDetails.image_list.length) {
                for(let i=1; i<=this.grid_details.resolutions.length; i++) {
                  this.layoutDetails.image_list.push({ rank: i, content_details: {}, btn_list: [], productList: [] });
                }
              }
            }
            else if(!this.layoutDetails.image_list.length) {
              this.layoutDetails.image_list.push({ rank: 1, content_details: {}, btn_list: [], productList: [] });
            }
            this.layoutDetails.image_list.forEach(img => {
              if(!Array.isArray(img.btn_list)) img.btn_list = [];
              if(!img.content_details) img.content_details = {};
              img.content_details.option_list = this.normalizeSectionOptionList(img.content_details.option_list);
            });
          }
          else if(this.layoutDetails.type=='grid' && !this.layoutDetails.image_list.length) {
            let gridIndex = this.commonService.grid_list.findIndex(obj => obj.type==this.layoutDetails.grid_type);
            if(gridIndex!=-1) {
              this.grid_details = this.commonService.grid_list[gridIndex];
              for(let i=1; i<=this.grid_details.resolutions.length; i++) this.layoutDetails.image_list.push({ rank: i });
            }
            else this.layoutDetails.image_list.push({ rank: 1 });
          }
          else if(this.layoutDetails.type=='testimonial') {
            if(!this.layoutDetails.image_list.length) this.layoutDetails.image_list.push({ rank: 1, content_details: {}, productList: [] });
          }
          else if(this.layoutDetails.type=='multiple_highlighted_section') {
            this.layoutDetails.image_list.forEach(element => {
              element.content_status = true;
              if(!element.content_details) element.content_details = {};
            });
            if(!this.layoutDetails.image_list.length) this.layoutDetails.image_list.push({ rank: 1, content_status: true, content_details: {}, productList: [] });
          }
          else if(this.layoutDetails.type=='shopping_assistant') {
            this.layoutDetails.image_list = [];
            this.shopping_assist_config = this.layoutDetails.shopping_assistant_config;
            if(!this.shopping_assist_config.changing_text?.length) this.shopping_assist_config.changing_text = [{ value: ''}];
          }
            else if(this.layoutDetails.type=='amenities') {
              if(!this.layoutDetails.text_list?.length) {
                this.layoutDetails.text_list = [this.getDefaultAmenityItem()];
              }
              else {
                this.layoutDetails.text_list.forEach(item => {
                  if(item.icon_name === undefined) item.icon_name = '';
                });
              }
            }
            else if(this.layoutDetails.type=='faq') {
              if(!this.layoutDetails.faq_list?.length) {
                this.layoutDetails.faq_list = [this.getDefaultFaqItem()];
              }
              this.layoutDetails.faq_list = this.normalizeFaqItems(this.layoutDetails.faq_list);
            }
          else if(this.layoutDetails.type=='cta') {
            this.maxImgCount = 1;
            if(!this.layoutDetails.image_list?.length) {
              this.layoutDetails.image_list = [{ rank: 1, points_list: [], productList: [] }];
            }
            this.layoutDetails.cta_list = this.normalizeCtaList(this.layoutDetails.cta_list);
            if(!this.layoutDetails.cta_list.length) this.layoutDetails.cta_list = [this.getDefaultCtaItem()];
          }
            else if(this.layoutDetails.type=='internal_links') {
              this.layoutDetails.group_list = this.normalizeInternalLinkGroups(this.layoutDetails.group_list, this.layoutDetails.cta_list);
              if(!this.layoutDetails.group_list.length) {
                this.layoutDetails.group_list = [this.getDefaultInternalLinkGroup()];
              }
              this.syncInternalLinkGroupRanks();
            }
            else if(this.layoutDetails.type=='dual_map') {
              if(!this.layoutDetails.map_list?.length) {
                this.layoutDetails.map_list = [this.getDefaultDualMapItem(), this.getDefaultDualMapItem()];
              }
              this.layoutDetails.map_list = this.normalizeDualMapList(this.layoutDetails.map_list);
            }
            else if(this.layoutDetails.type=='contact_info') {
              if(!this.layoutDetails.contact_info_list?.length) {
                this.layoutDetails.contact_info_list = [this.getDefaultContactInfoItem()];
              }
              this.layoutDetails.contact_info_list = this.normalizeContactInfoList(this.layoutDetails.contact_info_list);
            }
            else if(this.layoutDetails.type=='icon_card_grid') {
              if(!this.layoutDetails.icon_card_list?.length) {
                this.layoutDetails.icon_card_list = [this.getDefaultIconCardItem()];
              }
              this.layoutDetails.icon_card_list = this.normalizeIconCardList(this.layoutDetails.icon_card_list);
            }
            else if(this.layoutDetails.type=='content_section') {
              if(this.layoutDetails.btn_status === undefined) this.layoutDetails.btn_status = false;
              if(!this.layoutDetails.btn_style) this.layoutDetails.btn_style = 'primary';
              if(!this.layoutDetails.btn_text_color) this.layoutDetails.btn_text_color = 'light';
              if(!this.layoutDetails.btn_link_type) this.layoutDetails.btn_link_type = 'internal';
            }
            else if(this.layoutDetails.type=='feature_list') {
              if(!this.layoutDetails.feature_list?.length) {
                this.layoutDetails.feature_list = [this.getDefaultFeatureListItem()];
              }
              this.layoutDetails.feature_list = this.normalizeFeatureListItems(this.layoutDetails.feature_list);
          }
          else if(this.layoutDetails.type=='content_grid' && !this.layoutDetails.text_list?.length) {
            this.layoutDetails.text_list = [{}];
          }
          else if(this.layoutDetails.type=='hero_cta') {
            this.layoutDetails.cta_list = this.sanitizeHeroCtaList(this.layoutDetails.cta_list || []);
          }
          else if(this.layoutDetails.type=='video_section' && !this.layoutDetails.video_details) {
            this.layoutDetails.video_details = {};
          }
          else if(this.layoutDetails.type=='multi_categories') {
            if(this.layoutDetails.multicategory_list?.length) {
              for(let catData of this.layoutDetails.multicategory_list) {
                this.findProducts(catData);
                if(catData.image_list?.length) {
                  for(let x of catData.image_list) { this.findProducts(x); }
                }
              }
            }
            else this.layoutDetails.multicategory_list = [{ rank: 1, image_list: [{ rank: 1 }] }];
          }
          else if(!this.layoutDetails.image_list.length) {
            let gridIndex = this.commonService.blog_grid_list.findIndex(obj => obj.type==this.layoutDetails.grid_type);
            if(gridIndex!=-1) {
              this.grid_details = this.commonService.blog_grid_list[gridIndex];
              for(let i=1; i<=this.grid_details.count; i++) this.layoutDetails.image_list.push({ rank: i });
            }
            else this.layoutDetails.image_list.push({ rank: 1, points_list: [], productList: [] });
          }
          // find product
          if(this.layoutDetails.image_list?.length) {
            for(let x of this.layoutDetails.image_list)
            {
              this.findProducts(x);
              if (x.points_list?.length) {
                for (let pt of x.points_list) {
                  this.findProducts(pt);
                }
              }
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
          this.router.navigateByUrl("/setup/pages/extra-pages/modify/"+this.params.id);
        }
      });
    });
  }

  findProducts(x) {
    x.productList = [];
    if(x.link_type=='product' && x.product_id) {
			this.api.PRODUCT_DETAILS(x.product_id).subscribe(result => {
				if(result.status) {
          x.productList = [result.data];
          x.selected_product = result.data.name;
        }
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

  addNewImg() {
    if(this.layoutDetails.type=='testimonial') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_details: {} });
    }
    else if(this.layoutDetails.type=='amenities') {
      this.layoutDetails.text_list.push(this.getDefaultAmenityItem());
    }
    else if(this.layoutDetails.type=='faq') {
      this.layoutDetails.faq_list.push(this.getDefaultFaqItem(this.layoutDetails.faq_list.length + 1));
    }
    else if(this.layoutDetails.type=='internal_links') {
      this.layoutDetails.group_list.push(this.getDefaultInternalLinkGroup());
      this.syncInternalLinkGroupRanks();
    }
    else if(this.layoutDetails.type=='dual_map') {
      this.layoutDetails.map_list.push(this.getDefaultDualMapItem());
    }
    else if(this.layoutDetails.type=='feature_list') {
      this.layoutDetails.feature_list.push(this.getDefaultFeatureListItem());
    }
    else if(this.layoutDetails.type=='icon_card_grid') {
      this.layoutDetails.icon_card_list.push(this.getDefaultIconCardItem(this.layoutDetails.icon_card_list.length + 1));
    }
    else if(this.layoutDetails.type=='contact_info') {
      this.layoutDetails.contact_info_list.push(this.getDefaultContactInfoItem());
    }
    else if(this.layoutDetails.type=='multiple_highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_status: true, content_details: {} });
    }
    else if(this.layoutDetails.type=='section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, content_details: {}, btn_list: [] });
    }
    else if(this.layoutDetails.type=='content_grid') {
      this.layoutDetails.text_list.push({});
    }
    else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length+1, points_list: [] });
    }
  }

  async onUpdateLayout() {
    this.btnLoader = true;
    let layoutData = structuredClone(this.layoutDetails);
    this.fileList = new FormData();
    if(layoutData.type=='shopping_assistant') {
      layoutData.shopping_assistant_config = {};
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.page_id = this.params.id;
      layoutData._id = this.layoutDetails._id;
      for(let key in this.shopping_assist_config) {
        if(key!='image' && key!='temp_image' && this.shopping_assist_config.hasOwnProperty(key))
          layoutData.shopping_assistant_config[key] = this.shopping_assist_config[key];
      }
      if(this.shopping_assist_config.img_change) this.fileList.append('attachments', this.shopping_assist_config.image);
      else layoutData.shopping_assistant_config.image = this.shopping_assist_config.image;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='hero_cta') {
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.page_id = this.params.id;
      layoutData._id = this.layoutDetails._id;
      layoutData.cta_list = this.sanitizeHeroCtaList(layoutData.cta_list);
      if(this.layoutDetails.cover_img_change && this.layoutDetails.cover_img) {
        delete layoutData.cover_img;
        this.fileList.append('attachments', this.layoutDetails.cover_img, 'fc_cover');
      }
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='video_section') {
      layoutData.video_details = {};
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.page_id = this.params.id;
      layoutData._id = this.layoutDetails._id;
      for(let key in this.layoutDetails.video_details) {
        if(this.layoutDetails.video_details.hasOwnProperty(key) && key!='thumbnail' && key!='src' && key!='mobile_src' && key!='temp_image' && key!='temp_video' && key!='temp_mobile_video')
          layoutData.video_details[key] = this.layoutDetails.video_details[key];
      }
      if(this.layoutDetails.video_details.video_change) this.fileList.append('video', this.layoutDetails.video_details.src);
      else layoutData.video_details.src = this.layoutDetails.video_details.src;
      if(this.layoutDetails.video_details.mobile_video_change) this.fileList.append('mobile_video', this.layoutDetails.video_details.mobile_src);
      else layoutData.video_details.mobile_src = this.layoutDetails.video_details.mobile_src;
      if(this.layoutDetails.video_details.img_change) this.fileList.append('thumbnail', this.layoutDetails.video_details.thumbnail);
      else layoutData.video_details.thumbnail = this.layoutDetails.video_details.thumbnail;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
    else if(layoutData.type=='multi_categories') {
      await Promise.all(
        layoutData.multicategory_list.map(async (catData, i) => {
          catData.image_list = await this.onSetFormData2(i, catData.image_list);
        })
      );
      layoutData.store_id = this.commonService.store_details._id;
      layoutData.page_id = this.params.id;
      layoutData._id = this.layoutDetails._id;
      this.fileList.append('data', JSON.stringify(layoutData));
      this.callUpdateApi();
    }
      else if(layoutData.type=='content_grid' || layoutData.type=='amenities') {
        this.onSetFormData(layoutData.text_list).then((imgList) => {
          layoutData.text_list = imgList;
          layoutData.store_id = this.commonService.store_details._id;
          layoutData.page_id = this.params.id;
          layoutData._id = this.layoutDetails._id;
          this.fileList.append('data', JSON.stringify(layoutData));
          this.callUpdateApi();
        });
      }
      else if(layoutData.type=='faq') {
        layoutData.faq_list = this.normalizeFaqItems(layoutData.faq_list);
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='internal_links') {
        layoutData.group_list = this.normalizeInternalLinkGroups(layoutData.group_list, layoutData.cta_list);
        delete layoutData.cta_list;
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='dual_map') {
        layoutData.map_list = this.prepareDualMapListForSave(this.layoutDetails.map_list);
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='contact_info') {
        layoutData.contact_info_list = this.normalizeContactInfoList(layoutData.contact_info_list);
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        if(this.layoutDetails.cover_img_change && this.layoutDetails.cover_img) {
          delete layoutData.cover_img;
          this.fileList.append('attachments', this.layoutDetails.cover_img, 'fc_cover');
        }
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='icon_card_grid') {
        layoutData.icon_card_list = this.normalizeIconCardList(layoutData.icon_card_list);
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='content_section') {
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      }
      else if(layoutData.type=='cta') {
        layoutData.cta_list = this.normalizeCtaList(layoutData.cta_list);
        this.onSetFormData(layoutData.image_list).then((imgList) => {
          layoutData.image_list = imgList;
          layoutData.store_id = this.commonService.store_details._id;
          layoutData.page_id = this.params.id;
          layoutData._id = this.layoutDetails._id;
          this.fileList.append('data', JSON.stringify(layoutData));
          this.callUpdateApi();
        });
      }
      else if(layoutData.type=='feature_list') {
        this.onSetFeatureFormData(layoutData.feature_list).then((featureList) => {
          layoutData.feature_list = featureList;
          layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
    else {
      this.onSetFormData(layoutData.image_list).then((imgList) => {
        layoutData.image_list = imgList;
        layoutData.store_id = this.commonService.store_details._id;
        layoutData.page_id = this.params.id;
        layoutData._id = this.layoutDetails._id;
        this.fileList.append('data', JSON.stringify(layoutData));
        this.callUpdateApi();
      });
    }
  }

  callUpdateApi() {
    this.setup.SEGMENT_IMAGE_EXTRA_PAGE(this.fileList).subscribe(result => {
      this.btnLoader = false;
      if(result.status) {
        this.router.navigate(["/setup/pages/extra-pages/modify/"+this.params.id]);
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

  onSetFeatureFormData(featureList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<featureList.length; i++) {
        let featureData = featureList[i];
        let objData = Object.assign({}, featureData);
        delete objData.temp_img;
        if(featureData.img_change) {
          delete objData.image;
          this.fileList.append('attachments', featureData['image'], i+'_c');
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(devType, index, event) {
    delete this.layoutDetails.image_list[index]?.d_err_msg;
    delete this.layoutDetails.image_list[index]?.m_err_msg;
    delete this.layoutDetails.text_list?.[index]?.c_err_msg;
    delete this.layoutDetails.feature_list?.[index]?.c_err_msg;
    if(devType=='fc_cover') delete this.layoutDetails.cover_img_err;
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
          else if(devType=='content') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.text_list[index].temp_img = (<FileReader>event.target).result;
              this.layoutDetails.text_list[index].image = fileData;
              this.layoutDetails.text_list[index].img_change = true;
            }
            else this.layoutDetails.text_list[index].c_err_msg = true;
          }
          else if(devType=='feature') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.feature_list[index].temp_img = (<FileReader>event.target).result;
              this.layoutDetails.feature_list[index].image = fileData;
              this.layoutDetails.feature_list[index].img_change = true;
            }
            else this.layoutDetails.feature_list[index].c_err_msg = true;
          }
          else if(devType=='fc_cover') {
            if(fileInKB<=this.fileLimitInKB) {
              this.layoutDetails.temp_cover_img = (<FileReader>event.target).result;
              this.layoutDetails.cover_img = fileData;
              this.layoutDetails.cover_img_change = true;
            }
            else this.layoutDetails.cover_img_err = true;
          }
        }
        reader.readAsDataURL(fileData);
      }
      else console.log("Invaid file");
    }
  }

  getDefaultHeroCtaItem() {
    return {
      heading: '',
      description: '',
      icon_name: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      btn_list: []
    };
  }

  removeHeroCtaCard(index: number) {
    if(!this.layoutDetails.cta_list?.length) return;
    this.layoutDetails.cta_list.splice(index, 1);
  }

  sanitizeHeroCtaList(ctaList: any[]) {
    if(!Array.isArray(ctaList)) return [];
    return ctaList
      .filter((cta) => {
        const hasHeading = !!cta?.heading?.trim();
        const hasDescription = !!cta?.description?.trim();
        const hasButton = cta?.btn_status && (!!cta?.btn_text?.trim() || !!cta?.btn_link?.trim());
        return hasHeading || hasDescription || hasButton;
      })
      .map((cta) => ({
        heading: cta.heading || '',
        description: cta.description || '',
        icon_name: cta.icon_name || '',
        btn_status: !!cta.btn_status,
        btn_text: cta.btn_status ? (cta.btn_text || '') : '',
        btn_style: cta.btn_style || 'primary',
        btn_text_color: cta.btn_text_color || 'light',
        btn_link_type: cta.btn_status ? (cta.btn_link_type || 'internal') : 'internal',
        btn_link: cta.btn_status ? (cta.btn_link || '') : '',
      }));
  }

  getDefaultAmenityItem() {
    return {
      image: '',
      icon_name: '',
      name: '',
      description: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  getDefaultFaqItem(rank = 1) {
    return {
      ques: '',
      answer: '',
      rank
    };
  }

  normalizeFaqItems(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultFaqItem(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
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

  normalizeCtaList(ctaList: any[] = []) {
    return (Array.isArray(ctaList) ? ctaList : []).map(item => ({
      ...this.getDefaultCtaItem(),
      ...item
    }));
  }

  normalizeContactInfoList(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item) => ({
      ...this.getDefaultContactInfoItem(),
      ...item,
      btn_status: typeof item?.btn_status === 'boolean'
        ? item.btn_status
        : item?.btn_status !== 'false'
    }));
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

  normalizeInternalLinkGroups(groupList: any[] = [], ctaList: any[] = []) {
    const sourceGroups = groupList?.length ? groupList : (ctaList?.length ? [{
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      link_list: ctaList
    }] : []);

    return sourceGroups.map((group: any) => ({
      rank: Number(group?.rank) > 0 ? Number(group.rank) : 1,
      icon_name: group?.icon_name || '',
      heading: group?.heading || '',
      sub_heading: group?.sub_heading || '',
      description: group?.description || '',
      link_list: (group?.link_list?.length ? group.link_list : [this.getDefaultInternalLinkItem()]).map((item: any) => ({
        ...this.getDefaultInternalLinkItem(),
        ...item
      }))
    })).sort((a, b) => a.rank - b.rank)
      .map((group, index) => ({
        ...group,
        rank: index + 1
      }));
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

  getDefaultFeatureCard() {
    return {
      icon_name: '',
      name: '',
      detail: ''
    };
  }

  getDefaultFeatureListItem() {
    return {
      image: '',
      heading: '',
      sub_heading: '',
      description: '',
      features: [this.getDefaultFeatureCard()],
      cta_list: []
    };
  }

  getDefaultFeatureCta() {
    return {
      btn_text: '',
      btn_link_type: 'internal',
      btn_link: '',
      btn_style: 'primary',
      btn_text_color: 'light'
    };
  }

  normalizeFeatureListItems(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map(item => ({
      ...this.getDefaultFeatureListItem(),
      ...item,
      features: (Array.isArray(item?.features) ? item.features : []).length
        ? item.features.map((feature: any) => ({ ...this.getDefaultFeatureCard(), ...feature }))
        : [this.getDefaultFeatureCard()],
      cta_list: Array.isArray(item?.cta_list) ? item.cta_list.map((cta: any) => ({
        ...this.getDefaultFeatureCta(),
        ...cta
      })) : []
    }));
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
  
  onSetFormData2(pInd, imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++) {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        delete objData.temp_desktop_img;
        if(imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], pInd+'_'+i+'_d');
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  multiCatFileChangeListener(pIndex, index, event) {
    delete this.layoutDetails.multicategory_list[pIndex].image_list[index]?.d_err_msg;
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
        let reader = new FileReader();
        let fileData = event.target.files[0];
        let fileInKB = Math.round(fileData.size / 1024);
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB <= this.fileLimitInKB) {
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

  mobileVideoFileChangeListener(event) {
    delete this.layoutDetails.video_details.mobile_vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.videoLimitInKB) {
          this.layoutDetails.video_details.temp_mobile_video = (<FileReader>event.target).result;
          this.layoutDetails.video_details.mobile_src = fileData;
          this.layoutDetails.video_details.mobile_video_change = true;
        }
        else this.layoutDetails.video_details.mobile_vid_err_msg = true;
      }
      reader.readAsDataURL(fileData);
    }
  }

}
