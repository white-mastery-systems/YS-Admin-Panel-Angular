import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { StoreApiService } from '../../../../services/store-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { FeaturesApiService } from '../../features/features-api.service';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.scss'],
  animations: [SharedAnimations]
})

export class ModifyProductComponent implements OnInit {

  maxRank: any = 0; existVariantList: any = [];
  productForm: any; archiveForm: any = {};
  pageLoader: boolean; btnLoader: boolean;
  categoryList: any = []; intForm: any = {};
  addonList: any; tagList: any; noteList: any; taxRates: any;  colorList: any; amenityList: any;
  sizeCharts: any; faqList: any; taxonomyList: any; aiStyleList: any; imgTagList: any;  hlList: any;
  imgBaseUrl = environment.img_baseurl;
  imageIndex: any; imgWidth: any; imgHeight: any; primary_tax: any;
  image_count: number = environment.default_img_count;
  selectedVariantOptions: any []; selectedVariantIndex: number;
  configData: any= environment.config_data; brochForm: any = {};
  catSearch: string; productFeatures: any; vendorAdmin: boolean;
  selectedImage: any; croppedImage: any = {}; cropStatus: boolean;
  varIndex: number; imgIndex: number; resizeForm: any = {}; imgType: string;
  imageForm: any = { list: [] }; productUrl : string;
  videoForm: any = {}; videoLimitInKB: number = 10240; // 6144
  fileList: FormData; imgFile: any; imageChangedEvent: any; croppedFile: any;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute,
    private api: StoreApiService, private peApi: ProductExtrasApiService, public commonService: CommonService,
    private atp: AmazingTimePickerService, private deployApi: DeploymentService, private titleCase: TitleCasePipe,
    private fApi: FeaturesApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    let resolution = this.commonService.store_details.additional_features.cropper_resolution.split("x");
    this.imgWidth = parseFloat(resolution[0]); this.imgHeight = parseFloat(resolution[1]);
    if(this.commonService.store_details?.type=='estates') this.videoLimitInKB = 10240;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.store_branch_list.forEach(element => {
        element.selected = false;
      });
      this.commonService.redirect = "/product-sections/products";
      this.commonService.secondary_header = "Update Product";
      this.aiStyleList = []; delete this.catSearch;
      if(this.commonService.ys_features.indexOf('vendors')!=-1 && this.commonService.store_details?.login_type!='vendor') this.vendorAdmin = true;
      if(this.commonService.ys_features.indexOf('variant_image_tag')!=-1) this.image_count = environment.variant_img_count;
      this.btnLoader = false; this.pageLoader = true;
      this.maxRank = params.rank;
      this.addonList = []; this.tagList = []; this.noteList = [];
      this.taxRates = []; this.sizeCharts = [];  this.hlList = [];
      this.api.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          this.productFeatures = result.data;
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          this.amenityList = result.data.amenities.filter(obj => obj.status=='active');
          let tempAddonList = [];
          if(this.commonService.route_permission_list.indexOf('addon_products') == -1) {
            tempAddonList = result.data.addon_list.filter(obj => obj.status=='active');
          }
          let tempTagList = result.data.tag_list.filter(obj => obj.status=='active');
          let tempFaqList = result.data.faq_list.filter(obj => obj.status=='active');
          this.hlList = result.data.nearby.filter(obj => obj.status=='active');
          let tempNoteList = result.data.footnote_list;
          this.imgTagList = result.data.img_tag_list;
          // common features
          if(this.commonService.ys_features.indexOf('tax_rates')!=-1) {
            this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
            if(this.taxRates.length) {
              let taxIndex = this.taxRates.findIndex(obj => obj.primary);
              if(taxIndex!=-1) this.primary_tax = this.taxRates[taxIndex]._id;
            }
          }
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          this.colorList = result.data.color_list;
          this.api.PRODUCT_DETAILS(params.product_id).subscribe(result => {
            if(result.status) {
              this.productForm = result.data;
              if(!this.productForm.category_timestamp) this.productForm.category_timestamp = [];
              this.productUrl = '/product/'+result.data._id;
              if(result.data.seo_details?.page_url) this.productUrl = '/product/'+result.data.seo_details.page_url;
              if(this.productForm.handover_on) this.productForm.handover_on = new Date(this.productForm.handover_on);
              if(!this.productForm.video_details) this.productForm.video_details = {};
              this.videoForm = Object.assign({}, this.productForm.video_details);
              if(!this.productForm.disc_range) this.productForm.disc_range = [];
              if(!this.productForm.origin) this.productForm.origin = "";
              if(!this.productForm.meta_data) this.productForm.meta_data = {};
              if(!this.productForm.vendor_stock) this.productForm.vendor_stock = [];
              if(this.productForm.branch_ids?.length) {
                for(let bData of this.commonService.store_branch_list) {
                  if(this.productForm.branch_ids.indexOf(bData._id)!=-1) bData.selected = true;
                }
              }
              if(this.commonService.store_details?.login_type=='branch') {
                this.productForm.stock = this.productForm.vendor_stock.find(x => x._id.toString()==this.commonService.store_details?.login_id)?.stock || 0;
                if(this.productForm.variant_status && this.productForm.variant_list?.length) {
                  for(let varData of this.productForm.variant_list)
                  {
                    varData.stock = varData.vendor_stock.find(x => x._id.toString()==this.commonService.store_details?.login_id)?.stock || 0;
                  }
                }
              }
              else this.onSelectBranch();
              this.onCalcDiscRange();
              // get multi addon list
              if(this.commonService.route_permission_list.indexOf('addon_products') != -1) {
                this.onGetMultiAddon();
              }
              this.productForm.prev_rank = result.data.rank;
              if(this.productForm.image_tag_status) {
                this.productForm.variant_types.forEach(element => {
                  if(element.options.findIndex(obj => obj.value==this.productForm.image_list[0].tag) != -1) this.productForm.tag_variant = element.options;
                });
              }
              if(this.productForm.variant_list?.length) {
                this.productForm.variant_list.forEach(element => {
                  if(!element.sku) element.sku = this.productForm.sku;
                  if(!element.taxrate_id && this.productForm.taxrate_id) element.taxrate_id = this.productForm.taxrate_id;
                });
              }
              if(this.productForm.search_terms) {
                this.productForm.search_keywords = [];
                let sTerms = this.productForm.search_terms.split(', ');
                sTerms.forEach(el => {
                  this.productForm.search_keywords.push({ display: el, value: el });
                });
              }
              if(this.productForm.seo_details?.meta_keywords?.length) {
                this.productForm.seo_details.meta_keyword_list = [];
                this.productForm.seo_details.meta_keywords.forEach(el => {
                  this.productForm.seo_details.meta_keyword_list.push({ display: el, value: el });
                });
              }
              // image tags
              if(this.productForm.badge_list?.length) {
                this.productForm.badge_status = true;
                this.imgTagList.forEach(el => {
                  if(this.productForm.badge_list.indexOf(el._id)!=-1) el.checked = true;
                });
              }
              // highlights
              if(this.productForm.highlights?.length) {
                this.productForm.hl_status = true;
                this.hlList.forEach(el => {
                  let hInd = this.productForm.highlights.findIndex(x => Object.keys(x)[0] == el._id);
                  if(hInd != -1) el.value = this.productForm.highlights[hInd][el._id];
                });
              }
              // vendor
              if(this.productForm.vendor_id) {
                this.onChangeVendor(this.productForm.vendor_id);
              }
              else {
                this.tagListModify(tempTagList, this.productForm.tag_list).then((list) => {
                  this.tagList = list;
                });
                this.faqListModify(tempFaqList, this.productForm.faq_list).then((list) => {
                  this.faqList = list;
                });
                if(tempAddonList.length) {
                  this.adddonListModify(tempAddonList, this.productForm.addon_list).then((list) => {
                    this.addonList = list;
                  });
                }
                // foot note
                if(this.productForm.footnote_list.length) {
                  this.productForm.note_status = true;
                  this.footNoteListModify(tempNoteList, this.productForm.footnote_list).then((list) => {
                    this.noteList = tempNoteList;
                  });
                }
                else this.noteList = tempNoteList;
              }
              this.processCategoryList(this.productForm.category_id).then((list) => {
                this.categoryList = list;
              });
              // Amenities
              if(this.productForm.amenity_list?.length) {
                this.productForm.amenity_status = true;
                this.amenityList.forEach(al => {
                  if(this.productForm.amenity_list.indexOf(al._id) != -1) al.amen_checked = true;
                });
              }
              // Availability
              if(this.commonService.ys_features.indexOf('product_availability')!=-1) {
                if(this.productForm.available_days.length) {
                  this.productForm.availability_status = true;
                }
                else {
                  this.productForm.available_days = [
                    { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
                    { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
                    { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
                    { code: 6, day: "Saturday", active: false, opening_hrs: [] }
                  ];
                }
              }
              // AI Styles
              if(this.commonService.ys_features.indexOf('shopping_assistant')!=-1) {
                if(this.productForm.aistyle_list.length) this.productForm.aistyle_status = true;
                if(localStorage.getItem("aistyle_list")) {
                  this.aiStyleList = this.commonService.decryptData(localStorage.getItem("aistyle_list"));
                  this.aiStyleModify(this.aiStyleList, this.productForm.aistyle_list).then((list) => {
                    this.aiStyleList = list;
                  });
                }
                else {
                  this.peApi.AI_STYLE_DETAILS().subscribe(result => {
                    if(result.status) {
                      this.commonService.aistyle_list = result.data;
                      this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
                      this.aiStyleList = result.data;
                      this.aiStyleModify(this.aiStyleList, this.productForm.aistyle_list).then((list) => {
                        this.aiStyleList = list;
                      });
                    }
                  });
                }
              }
              // Recipes
              if(!this.productForm.recipes) this.productForm.recipes = [];
              if(this.commonService.ys_features.indexOf('recipes')!=-1) {
                if(!localStorage.getItem("recipe_list")) {
                  this.fApi.RECIPE_LIST().subscribe(result => {
                    if(result.status) {
                      this.commonService.recipe_list = [];
                      for(let x of result.list) {
                        this.commonService.recipe_list.push({ _id: x._id, name: x.name });
                      }
                      this.commonService.updateLocalData('recipe_list', this.commonService.recipe_list);
                      if(this.commonService.recipe_list.length && this.productForm.recipes.length) {
                        this.productForm.recipe_status = true;
                        this.commonService.recipe_list.forEach(al => {
                          delete al.recipe_checked;
                          if(this.productForm.recipes.indexOf(al._id) != -1) al.recipe_checked = true;
                        });
                      }
                    }
                  });
                }
                else {
                  if(this.commonService.recipe_list.length) {
                    if(this.productForm.recipes.length) this.productForm.recipe_status = true;
                    this.commonService.recipe_list.forEach(al => {
                      delete al.recipe_checked;
                      if(this.productForm.recipes.indexOf(al._id) != -1) al.recipe_checked = true;
                    });
                  }
                }
              }
            }
            else console.log("response", result);
            setTimeout(() => { this.pageLoader = false; }, 500);
          });
        }
        else console.log("response", result);
      });
      // archieve
      if(this.commonService.ys_features.indexOf('product_archive')!=-1 && !localStorage.getItem('archive_list')) {
        this.peApi.ARCHIVE_LIST().subscribe(result => {
          if(result.status) {
            this.commonService.archive_list = result.list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
            this.commonService.updateLocalData('archive_list', this.commonService.archive_list);
          }
        });
      }
    });
  }

  onSelectBranch() {
    if(this.productForm.variant_status) {
      for(let varData of this.productForm.variant_list)
      {
        let vendorStock = varData.vendor_stock;
        varData.vendor_stock = [];
        for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
          let venData = vendorStock.find(el => el._id==x._id);
          let prodStock = venData?.stock || 0;
          varData.vendor_stock.push({ _id: x._id, name: x.name, stock: prodStock });
        }
      }
    }
    else {
      let vendorStock = this.productForm.vendor_stock;
      this.productForm.vendor_stock = [];
      for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
        let venData = vendorStock.find(el => el._id==x._id);
        let prodStock = venData?.stock || 0;
        this.productForm.vendor_stock.push({ _id: x._id, name: x.name, stock: prodStock });
      }
    }
  }

  onGetMultiAddon() {
    this.peApi.ADDON_PRODUCTS_LIST().subscribe(result => {
			if(result.status) {
        this.adddonListModify(result.list, this.productForm.addon_list).then((list) => {
          this.addonList = list;
        });
      }
      else console.log("response", result);
		});
  }

  onCalcDiscRange() {
    if(this.productForm.disc_status && this.productForm.disc_by && this.productForm.disc_range?.length && !this.productForm.variant_status && this.productForm.selling_price) {
      this.productForm.disc_range.forEach(el => {
        if(this.productForm.disc_by=='percentage') {
          if(el.value) {
            let discAmount = Math.round((el.value/100) * this.productForm.selling_price);
            el.price = this.productForm.selling_price - discAmount;
          }
        }
        else el.price = this.productForm.selling_price - el.value;
      });
    }
  }

  onUpdate() {
    if(this.commonService.store_details.login_type=='branch')
    {
      let formData: any = { _id: this.productForm._id, branch_id: this.commonService.store_details.login_id };
      if(this.productForm.variant_status && this.productForm.variant_list?.length) {
        formData.variant_list = this.productForm.variant_list.map(({ sku, stock }) => ({ sku, stock: parseFloat(stock) }));
      }
      else formData.stock = this.productForm.stock;
      this.btnLoader = true; delete this.productForm.errorMsg;
      this.api.UPDATE_PRODUCT_BRANCH_STOCK(formData).subscribe(result => {
        this.updateDeployStatus();
        if(result.status) {
          this.router.navigate(['/product-sections/products']);
        }
        else {
          this.btnLoader = false;
          this.productForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.fileList = new FormData();
      this.btnLoader = true;
      delete this.productForm.errorMsg;
      // category list
      this.productForm.category_id = []; this.productForm.category_timestamp = [];
      this.productForm.category_name = "";
      this.categoryList.forEach(element => {
        if(element.selected) {
          this.productForm.category_id.push(element._id);
          let pushData: any = { cat_id: element._id };
          if(element.linked_on) pushData.linked_on = element.linked_on;
          if(element.updated_on) pushData.updated_on = element.updated_on;
          this.productForm.category_timestamp.push(pushData);
          this.productForm.category_name += element.name+', ';
        }
      });
      if(this.productForm.category_id.length) this.productForm.category_name = this.productForm.category_name.slice(0, -2);
      this.productForm.branch_ids = this.commonService.store_branch_list.filter(el => el.selected).map(el => el._id);
      // discount
      if(!this.productForm.disc_status || this.commonService.store_details?.type=='quot_based') {
        this.productForm.disc_percentage = null;
        this.productForm.discounted_price = this.productForm.selling_price;
        if(this.productForm.variant_list) {
          this.productForm.variant_list.forEach(object => {
            object.discounted_price = object.selling_price;
          });
        }
      }
      // vendor stock
      if(this.productForm.vendor_stock?.length) {
        this.productForm.stock = this.productForm.vendor_stock.reduce((accumulator, currentValue) => {
          return accumulator + currentValue['stock'];
        }, 0);
      }
      // variants
      let tempVariants = [];
      if(this.productForm.variant_status) {
        this.productForm.vendor_stock = [];
        let totalStock = 0;
        this.productForm.variant_list.forEach(object => {
          if(!object.stock) object.stock = 0;
          if(!object.vendor_stock) object.vendor_stock = [];
          if(object.vendor_stock.length) {
            object.stock = object.vendor_stock.reduce((accumulator, currentValue) => {
              return accumulator + currentValue['stock'];
            }, 0);
          }
          totalStock += parseFloat(object.stock);
          if(tempVariants.indexOf(object.sku) == -1) tempVariants.push(object.sku);
          else {
            this.btnLoader = false;
            this.productForm.errorMsg = "Duplicate SKU Exists";
          }
        });
        if(this.productForm.variant_list[0].taxrate_id) this.productForm.taxrate_id = this.productForm.variant_list[0].taxrate_id;
        this.productForm.sku = this.productForm.variant_list[0].sku;
        this.productForm.selling_price = this.productForm.variant_list[0].selling_price;
        this.productForm.discounted_price = this.productForm.variant_list[0].discounted_price;
        this.productForm.stock = totalStock;
        // construct variant list
        this.productForm.variant_list.forEach(object => {
          object.stock = parseFloat(object.stock);
          object.weight = parseFloat(object.weight);
          object.selling_price = parseFloat(object.selling_price);
          object.discounted_price = parseFloat(object.discounted_price);
        });
        // group vendor stock
        this.productForm.vendor_stock = Object.values(
          this.productForm.variant_list.flatMap(item => item.vendor_stock)
          .reduce((acc, vendor) => {
            if (!acc[vendor._id]) {
              acc[vendor._id] = { ...vendor, stock: parseFloat(vendor.stock) };
            } else {
              acc[vendor._id].stock += parseFloat(vendor.stock);
            }
            return acc;
          }, {})
        );
      }
      this.productForm.sku = this.commonService.skuFormat(this.productForm.sku);
      // addons
      this.productForm.addon_list = [];
      if(this.productForm.addon_status) {
        this.addonList.forEach(object => {
          if(object.addon_checked) this.productForm.addon_list.push({ addon_id: object._id });
        });
      }
      if(!this.productForm.addon_status || !this.addonList.length) this.productForm.addon_must = false;
      // recipes
      this.productForm.recipes = [];
      if(this.productForm.recipe_status) {
        this.productForm.recipes = this.commonService.recipe_list.filter(el => el.recipe_checked).map(el => el._id);
      }
      // amenities
      this.productForm.amenity_list = [];
      if(this.productForm.amenity_status) {
        this.amenityList.forEach(el => {
          if(el.amen_checked) this.productForm.amenity_list.push(el._id);
        });
      }
      // tag
      this.productForm.tag_list = [];
      if(this.productForm.tag_status) {
        this.tagList.forEach(tagObject => {
          let optionArray = [];
          tagObject.option_list.forEach(optionObject => {
            if(optionObject.tag_option_checked) optionArray.push(optionObject.name);
          });
          if(optionArray.length) this.productForm.tag_list.push({ [tagObject._id]: optionArray });
        });
      }
      // highlights
      this.productForm.highlights = [];
      if(this.productForm.hl_status) {
        this.hlList.forEach(nlObj => {
          if(nlObj.value?.trim()) this.productForm.highlights.push({ [nlObj._id]: nlObj.value.trim() });
        });
      }
      // ai styles
      this.productForm.aistyle_list = [];
      if(this.productForm.aistyle_status) {
        this.aiStyleList.forEach(section => {
          let optionArray = [];
          if(section.type=='either_or') optionArray.push(section.selected_option);
          else {
            section.option_list.forEach(option => {
              if(option.aistyle_option_checked) optionArray.push(option._id);
            });
          }
          if(optionArray.length) this.productForm.aistyle_list.push({ [section._id]: optionArray });
        });
      }
      // foot note
      this.productForm.footnote_list = [];
      if(this.productForm.note_status) {
        this.noteList.forEach(object => {
          if(object.selected_option) this.productForm.footnote_list.push({ name: object.name, value: object.selected_option });
        });
      }
      // faq
      this.productForm.faq_list = [];
      if(this.productForm.faq_status) {
        this.faqList.forEach(faqObject => {
          if(faqObject.selected_answer) this.productForm.faq_list.push({ [faqObject._id]: faqObject.selected_answer });
        });
      }
      if(!this.productForm.availability_status) this.productForm.available_days = [];
      // seo
      this.productForm.seo_status = true;
      this.productForm.seo_details.meta_keywords = [];
      if(this.productForm.seo_details?.meta_keyword_list) {
        this.productForm.seo_details.meta_keyword_list.forEach(obj => {
          this.productForm.seo_details.meta_keywords.push(obj.value);
        });
      }
      this.productForm.search_terms = "";
      if(this.productForm.search_keywords?.length) {
        this.productForm.search_keywords.forEach(el => {
          this.productForm.search_terms += el.value+', ';
        });
        this.productForm.search_terms = this.productForm.search_terms.slice(0, -2);
      }
      if(this.productForm.disc_status && this.commonService.ys_features.indexOf('tier_pricing')!=-1) {
        this.productForm.discounted_price = this.productForm.selling_price;
      }
      // img badges
      this.productForm.badge_list = [];
      if(this.productForm.badge_status) {
        this.imgTagList.forEach(obj => {
          if(obj.checked) this.productForm.badge_list.push(obj._id);
        });
      }
      if(!this.productForm.taxrate_id && this.primary_tax) this.productForm.taxrate_id = this.primary_tax;
      if(!this.productForm.taxonomy_id && this.taxonomyList.length) {
        let tIndex = this.taxonomyList.findIndex(obj => obj.primary);
        if(tIndex!=-1) this.productForm.taxonomy_id = this.taxonomyList[tIndex]._id;
        else this.productForm.taxonomy_id = this.taxonomyList[0]._id;
      }
      // update details
      let formData = this.productForm;
      if(this.commonService.store_details.login_type=='vendor' && this.commonService.vendor_features.indexOf('update_product_stock_only')!=-1) {
        formData = {
          _id: this.productForm._id, sku: this.productForm.sku, rank: this.productForm.rank, prev_rank: this.productForm.prev_rank, stock: this.productForm.stock,
          variant_status: this.productForm.variant_status, variant_types: this.productForm.variant_types, variant_list: this.productForm.variant_list
        };
      }
      if(!this.productForm.errorMsg) {
        if(this.productForm.description==null) this.productForm.description = "";
        if(this.commonService.store_details?._id == environment.config_data.chettinad_id) {
          const errorList = [
            { condition: !this.productForm.category_id?.length, message: "Please select catalog", id: 'category' },
            { condition: this.productForm.addon_status && !this.productForm.addon_list?.length, message: "Please select addon", id: 'multi_addon' },
            { condition: this.productForm.tag_status && this.tagList.length != this.productForm.tag_list?.length, message: "Please select all tags", id: 'tag_list' },
            { condition: this.productForm.note_status && this.noteList.length != this.productForm.footnote_list?.length, message: "Please select all foot notes", id: 'footnote_list' }
          ];
          const errData = errorList.find(e => e.condition);
          if (errData) {
            this.btnLoader = false;
            this.productForm.errorMsg = errData.message;
            if(['tag_list', 'footnote_list'].includes(errData.id)) {
              let arr = [];
              let list = errData.id=='tag_list'? this.tagList: this.noteList;
              list.forEach(item => {
                if (errData.id === 'tag_list') {
                  if (!item.option_list.some(option => option.tag_option_checked)) {
                    arr.push(`tag_${item._id}`);
                  }
                }
                else {
                  if (!item.selected_option) arr.push(`note_${item._id}`);
                }
              });
              if (arr.length) errData.id = arr[0];
            }
            let el:HTMLElement = document.getElementById(errData.id);
            let topPosition = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: topPosition - 100, behavior: 'smooth' }); 
            this.commonService.toastMsg = errData.message;
            this.commonService.toastErr = true;
            this.commonService.clearToast(10000)
          } 
          else this.callApi(formData);
        }
        else this.callApi(formData);
      }
    }
  }

  async callApi(formData) {
    if(this.videoForm.img_change && this.videoForm.img_file) this.fileList.append('thumbnail', this.videoForm.img_file);
    if(this.videoForm.video_change && this.videoForm.src_file) this.fileList.append('video', this.videoForm.src_file);
    if(this.brochForm.broch_change && this.brochForm.src) this.fileList.append('brochure', this.brochForm.src);
    let sendData: any = {};
    for(let key in formData) {
      if (formData.hasOwnProperty(key)) sendData[key] = formData[key];
    }
    if(sendData.image_list?.length) sendData.image_list = await this.onContSetFormData(sendData.image_list, 'product');
    if(sendData.variant_status && sendData.variant_list?.length) sendData.variant_list = await this.onContSetFormData(sendData.variant_list, 'variant');
    this.fileList.append('data', JSON.stringify(sendData));    
    this.api.UPDATE_PRODUCT(this.fileList).subscribe(result => {
      this.updateDeployStatus();
      if(result.status) {
        this.router.navigate(['/product-sections/products']);
      }
      else {
        this.btnLoader = false;
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onContSetFormData(imgList, type) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      if(type=='product') {
        for(let i=0; i<imgList.length; i++)
        {
          let imgData = Object.assign({}, imgList[i]);
          if(imgData.img_change) {
            this.fileList.append('product_attachments', imgData['file'], i+'_p');
            delete imgData.file; delete imgData.image;
          }
          updatedList.push(imgData);
        }
        resolve(updatedList);
      }
      else if(type=='variant') {
        for(let i=0; i<imgList.length; i++)
        {
          let pImgData = Object.assign({}, imgList[i]);
          let innerArr = [], vimgList = [];
          if(pImgData.image_list) { vimgList = pImgData.image_list; }
          for(let j=0; j<vimgList.length; j++)
          {
            let imgData = Object.assign({}, vimgList[j]);
            if(imgData.img_change) {
              this.fileList.append('variant_attachments', imgData['file'], i+'_'+j+'_v');
              delete imgData.file; delete imgData.image;
            }
            innerArr.push(imgData);
          }
          pImgData.image_list = innerArr;
          updatedList.push(pImgData);
        }
        resolve(updatedList);
      }
      else resolve(updatedList);
    });
  }

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['products']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.products": new Date() };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

  onMoveToArchive() {
    this.api.MOVE_PRODUCT_TO_ARCHIVE(this.archiveForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/product-sections/products']);
      }
      else {
        this.archiveForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // Delete
  onDelete() {
    this.btnLoader = true;
    this.api.DELETE_PRODUCT({ _id: this.productForm._id }).subscribe(result => {
      this.updateDeployStatus();
      setTimeout(() => { this.btnLoader = false; }, 500);
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/product-sections/products']);
      }
      else {
        this.productForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onEditImages(type, index, list, modalName) {
    this.imageForm = { type: type, index: index, list: [] };
    for(let imgData of list) {
      let objData  = {};
      for(let key in imgData) {
        if(imgData.hasOwnProperty(key)) objData[key] = imgData[key];
      }
      this.imageForm.list.push(objData);
    }
    this.modalService.open(modalName, {scrollable : true});
  }
  onSaveImages() {
    if(this.imageForm.type=='product') {
      this.productForm.image_list = this.imageForm.list;
    }
    else {
      this.productForm.variant_list[this.imageForm.index].image_list = this.imageForm.list;
    }
  }

  adddonListModify(defaultList, addonList) {
    return new Promise((resolve, reject) => {
      defaultList.forEach(object => {
        if(addonList.find(x => x.addon_id == object._id)) object.addon_checked = true;
      });
      resolve(defaultList);
    });
  }

  tagListModify(tagList, productTagList) {
    return new Promise((resolve, reject) => {
      tagList.forEach(tagObject => {
        let tagIndex = productTagList.findIndex(x => Object.keys(x)[0] == tagObject._id);
        if(tagIndex != -1) {
          tagObject.option_list.forEach(optionObject => {
            let optionIndex = productTagList[tagIndex][tagObject._id].findIndex(x => x == optionObject.name);
            if(optionIndex != -1)
              optionObject.tag_option_checked = true;
          });
        }
      });
      resolve(tagList);
    });
  }

  aiStyleModify(styleList, productStyleList) {
    return new Promise((resolve, reject) => {
      styleList.forEach(tagObject => {
        let tagIndex = productStyleList.findIndex(x => Object.keys(x)[0] == tagObject._id);
        if(tagIndex != -1) {
          if(productStyleList[tagIndex][tagObject._id]?.length) {
            if(tagObject.type=='either_or') {
              tagObject.selected_option = productStyleList[tagIndex][tagObject._id][0];
            }
            else {
              tagObject.option_list.forEach(optionObject => {
                let optionIndex = productStyleList[tagIndex][tagObject._id].findIndex(x => x == optionObject._id);
                if(optionIndex != -1) optionObject.aistyle_option_checked = true;
              });
            }
          }
        }
      });
      resolve(styleList);
    });
  }

  faqListModify(faqList, productFaqList) {
    return new Promise((resolve, reject) => {
      faqList.forEach(faqObject => {
        let tagIndex = productFaqList.findIndex(x => Object.keys(x)[0] == faqObject._id);
        if(tagIndex != -1) {
          let answerIndex = faqObject.answer_list.findIndex(x => x._id == productFaqList[tagIndex][faqObject._id]);
          if(answerIndex==-1) answerIndex = 0;
          faqObject.selected_answer = faqObject.answer_list[answerIndex]._id;
        }
      });
      resolve(faqList);
    });
  }

  processCategoryList(categoryId) {
    return new Promise((resolve, reject) => {
      this.commonService.catalog_list.forEach(element => {
        element.selected = false; delete element.linked_on; delete element.updated_on;
        if(categoryId.findIndex(x => x == element._id)!=-1) element.selected = true;
        let tInd = this.productForm.category_timestamp.findIndex(x => x.cat_id==element._id);
        if(tInd!=-1) {
          let cData = this.productForm.category_timestamp[tInd];
          element.linked_on = cData.linked_on;
          if(cData.updated_on) element.updated_on = cData.updated_on;
        }
      });
      resolve(this.commonService.catalog_list);
    });
  }

  footNoteListModify(tempList, productNoteList) {
    return new Promise((resolve, reject) => {
      tempList.forEach(element => {
        let index = productNoteList.findIndex(object => object.name==element.name);
        if(index!=-1) element.selected_option = productNoteList[index].value;
      });
      resolve(tempList);
    });
  }

  /* Common Functions */
  onChangeVendor(vendorId) {
    this.setVendorProdTag(vendorId);
    this.addonList = []; this.faqList = []; this.sizeCharts = []; this.noteList = [];
    this.api.VENDOR_FEATURES(vendorId).subscribe(result => {
      if(result.status) this.setVendorInfo(result.data);
      else console.log("response", result);
    });
  }
  setVendorInfo(vInfo) {
    let tempAddonList = vInfo.addon_list.filter(obj => obj.status=='active');
    let tempFaqList = vInfo.faq_list.filter(el => el.status=='active');
    this.sizeCharts = vInfo.size_chart.filter(el => el.status=='active');
    // foot notes
    let tempNoteList = vInfo.footnote_list;
    if(this.productForm.footnote_list.length) {
      this.productForm.note_status = true;
      this.footNoteListModify(tempNoteList, this.productForm.footnote_list).then((list) => {
        this.noteList = tempNoteList;
      });
    }
    else this.noteList = tempNoteList;
    this.faqListModify(tempFaqList, this.productForm.faq_list).then((list) => {
      this.faqList = list;
    });
    this.adddonListModify(tempAddonList, this.productForm.addon_list).then((list) => {
      this.addonList = list;
    });
  }
  setVendorProdTag(vendorId) {
    this.tagList = []; let tempTagList = [];
    this.productFeatures.tag_list.filter(obj => obj.status=='active').forEach(obj => {
      obj.option_list = [];
      let vtIndex = obj.vendor_list.findIndex(v => v.vendor_id==vendorId);
      if(vtIndex!=-1) {
        obj.option_list = obj.vendor_list[vtIndex].option_list;
        tempTagList.push(obj);
      }
    });
    this.tagListModify(tempTagList, this.productForm.tag_list).then((list) => {
      this.tagList = list;
    });
  }

  fileChangeListener(elemName, event) {
    delete this.selectedImage; delete this.imgFile;
    this.croppedImage = {}; this.resizeForm = {};
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
        let sizekb = inFile.size/1024;
        let myReader: FileReader = new FileReader();
        myReader.onload = (event: ProgressEvent) => {
          this.croppedImage.original = (<FileReader>event.target).result;
          this.selectedImage = (<FileReader>event.target).result;
          this.imgFile = inFile;
          let imgTag: any = new Image();
          imgTag.src = (<FileReader>event.target).result;
          imgTag.onload = () => {
            this.resizeForm.width = imgTag.width;
            this.resizeForm.height = imgTag.height;
            this.imgAlgorithm(sizekb);
          }
        };
        myReader.readAsDataURL(inFile);
        document.getElementById('imageModal').click();
      }
      else console.log("Invaid file");
      let el: any = document.getElementById(elemName);
      if(el) el.value = "";
    }
  }
  setImageData() {
    this.cropStatus = true;
    if(this.imgFile) {
      // Trigger the file input event with the selected file
      this.imageChangedEvent = {
        target: { files: [this.imgFile] }
      };
    }
    else console.error('No file selected');
  }
  imageCropped(event: any) {
    this.croppedImage = event.objectUrl;
    this.croppedFile = new File([event.blob], 'cropped-image.png', { type: 'image/png' });
  }
  saveImage() {
    let objData: any = { img_change: true };
    if(this.cropStatus) {
      objData.image = this.croppedImage;
      objData.file = this.croppedFile;
    }
    else {
      objData.resize_config = this.resizeForm;
      objData.image = this.selectedImage;
      objData.file = this.imgFile;
    }
    // set image
    if(this.imgType=='product') {
      if(this.imgIndex) this.productForm.image_list[this.imgIndex-1] = objData;
      else this.productForm.image_list.push(objData);
    }
    else if(this.imgType=='variant') {
      if(this.imgIndex) this.productForm.variant_list[this.varIndex].image_list[this.imgIndex-1] = objData;
      else {
        if(!this.productForm.variant_list[this.varIndex].image_list) this.productForm.variant_list[this.varIndex].image_list = [];
        this.productForm.variant_list[this.varIndex].image_list.push(objData);
      }
    }
  }
  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imgAlgorithm(sizekb) {
    let ratio = this.resizeForm.height/this.resizeForm.width;
    let customValue = (sizekb/(this.resizeForm.width*this.resizeForm.height))*100000;
    let compression = 97.005769-(0.399058*customValue);
    this.resizeForm.quality = parseFloat(compression.toFixed(0));
    if(this.resizeForm.width === this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth;
    }
    else if(this.resizeForm.width > this.resizeForm.height) {
      this.resizeForm.crop_width = this.imgWidth;
      this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
    }
    else if(this.resizeForm.width < this.resizeForm.height) {
      if(ratio <= 1.177) {
        this.resizeForm.crop_width = this.imgWidth;
        this.resizeForm.crop_height = this.imgWidth/this.resizeForm.width*this.resizeForm.height;
      }
      else {
        this.resizeForm.crop_width = this.imgHeight/this.resizeForm.height*this.resizeForm.width;
        this.resizeForm.crop_height = this.imgHeight; 
      }
    }
    else console.log("ratio", ratio);
    this.resizeForm.crop_width = parseFloat(this.resizeForm.crop_width.toFixed(0));
    this.resizeForm.crop_height = parseFloat(this.resizeForm.crop_height.toFixed(0));
  }

  selectAllAddons(value) {
    this.addonList.forEach(object => {
      object.addon_checked = value;
    });
  }
  
  discountCalc(x, triggerFromDisc) {
    if(x.disc_status) {
      if(this.commonService.store_details?._id != this.configData.chettinad_id || triggerFromDisc || x.disc_percentage) {
        let discPercentage = 0;
        if(x.disc_percentage && x.disc_percentage!='') discPercentage = x.disc_percentage;
        if(x.variant_types.length) {
          x.variant_list.forEach(object => {
            let sellPrice = 0;
            if(object.selling_price && object.selling_price!='') sellPrice = object.selling_price;
            object.discounted_price = this.discountFormula(sellPrice, discPercentage);
          });
        }
        else {
          let sellPrice = 0;
          if(x.selling_price && x.selling_price!='') sellPrice = x.selling_price;
          x.discounted_price = this.discountFormula(sellPrice, discPercentage);
        }
      }
      else if(!x.disc_percentage) {
        if(x.variant_types.length)
          x.variant_list.forEach(object => { object.discounted_price = ''; });
        else x.discounted_price = '';
      }
    }
  }

  discountFormula(price, percentage) {
    let discAmt: any = (price * (percentage/100)).toFixed(2);
    let discountedPrice = 0;
    if(parseFloat(price) >= discAmt) discountedPrice = price - discAmt;
    return discountedPrice;
  }

  onAddColorOptions(modalName) {
    this.selectedVariantOptions = [];
    this.productForm.variant_types[this.selectedVariantIndex].options.forEach(obj => {
      this.selectedVariantOptions.push({display: obj.display});
    });
    if(!this.selectedVariantOptions.length) this.selectedVariantOptions = [{}];
    this.modalService.open(modalName);
  }
  onSetVariantColors() {
    let newOptions = [];
    this.selectedVariantOptions.forEach(obj => {
      if(newOptions.findIndex(el => el.display==obj.display) == -1) newOptions.push({display: obj.display, value: obj.display});
    });
    this.productForm.variant_types[this.selectedVariantIndex].options = newOptions;
    document.getElementById('closeModal').click();
    this.onCreateVariantList(this.productForm.variant_types);
  }

  onChangeVariant(x) {
    this.productForm.variant_list=[];
    if(x) this.productForm.variant_types=[{ options: [] }];
    else this.productForm.variant_types=[];
  }

  onRemoveVariantType(x, index) {
    x.variant_types.splice(index, 1);
    if(!x.variant_types.length) x.variant_status = false;
    this.onCreateVariantList(x.variant_types);
  }

  onCreateVariantList(variantTypes) {
    if(!this.productForm.variant_list) this.productForm.variant_list = [];
    this.existVariantList = this.productForm.variant_list;
    this.productForm.variant_list = [];
    if(variantTypes.length===1 && variantTypes[0].options.length) {
      this.oneVariant(variantTypes[0])
    }
    else if(variantTypes.length===2) {
      if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
    }
    else if(variantTypes.length===3) {
      if(variantTypes[0].options.length && variantTypes[1].options.length && variantTypes[2].options.length)
        this.threeVariant(variantTypes[0], variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length && variantTypes[1].options.length)
        this.twoVariant(variantTypes[0], variantTypes[1]);
      else if(variantTypes[0].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[0], variantTypes[2]);
      else if(variantTypes[1].options.length && variantTypes[2].options.length)
        this.twoVariant(variantTypes[1], variantTypes[2]);
      else if(variantTypes[0].options.length)
        this.oneVariant(variantTypes[0]);
      else if(variantTypes[1].options.length)
        this.oneVariant(variantTypes[1]);
      else if(variantTypes[2].options.length)
        this.oneVariant(variantTypes[2]);
    }
  }

  oneVariant(variantOne) {
    variantOne.options.forEach(objectOne => {
      let jsonData: any = { variants: [objectOne.value], [variantOne.name]: objectOne.value };
      let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value);
      if(varIndex != -1)
        jsonData = this.varEventOne(this.existVariantList, varIndex, jsonData);
      else
        jsonData = this.varEventTwo(this.existVariantList, jsonData);
      this.productForm.variant_list.push(jsonData);
    });
    this.existVariantList = this.productForm.variant_list;
  }
  twoVariant(variantOne, variantTwo) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        let jsonData: any = { variants: [objectOne.value, objectTwo.value], [variantOne.name]: objectOne.value, [variantTwo.name]: objectTwo.value };
        let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value && obj[variantTwo.name]==objectTwo.value);
        if(varIndex != -1)
          jsonData = this.varEventOne(this.existVariantList, varIndex, jsonData);
        else
          jsonData = this.varEventTwo(this.existVariantList, jsonData);
        this.productForm.variant_list.push(jsonData);
      });
    });
    this.existVariantList = this.productForm.variant_list;
  }
  threeVariant(variantOne, variantTwo, variantThree) {
    variantOne.options.forEach(objectOne => {
      variantTwo.options.forEach(objectTwo => {
        variantThree.options.forEach(objectThree => {
          let jsonData: any = { variants: [objectOne.value, objectTwo.value, objectThree.value], [variantOne.name]: objectOne.value, [variantTwo.name]: objectTwo.value, [variantThree.name]: objectThree.value };
          let varIndex = this.existVariantList.findIndex(obj =>  obj[variantOne.name]==objectOne.value && obj[variantTwo.name]==objectTwo.value && obj[variantThree.name]==objectThree.value);
          if(varIndex != -1)
            jsonData = this.varEventOne(this.existVariantList, varIndex, jsonData);
          else
            jsonData = this.varEventTwo(this.existVariantList, jsonData);
          this.productForm.variant_list.push(jsonData);
        });
      });
    });
    this.existVariantList = this.productForm.variant_list;
  }

  varEventOne(existVariantList, varIndex, jsonData) {
    jsonData.sku = existVariantList[varIndex].sku;
    jsonData.selling_price = existVariantList[varIndex].selling_price;
    jsonData.stock = 0; jsonData.image_list = [];
    jsonData.vendor_stock = [];
    for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
      jsonData.vendor_stock.push({ _id: x._id, name: x.name, stock: 0 });
    }
    if(existVariantList[varIndex].stock) jsonData.stock = existVariantList[varIndex].stock;
    if(existVariantList[varIndex].image_list) jsonData.image_list = existVariantList[varIndex].image_list;
    if(existVariantList[varIndex].discounted_price) jsonData.discounted_price = existVariantList[varIndex].discounted_price;
    if(existVariantList[varIndex].taxrate_id) jsonData.taxrate_id = existVariantList[varIndex].taxrate_id;
    if(existVariantList[varIndex].weight) jsonData.weight = existVariantList[varIndex].weight;
    if(existVariantList[varIndex].vendor_stock) jsonData.vendor_stock = existVariantList[varIndex].vendor_stock;
    if(!jsonData.taxrate_id && this.primary_tax) jsonData.taxrate_id = this.primary_tax;
    return jsonData;
  }
  varEventTwo(existVariantList, jsonData) {
    jsonData.stock = 0;
    jsonData.vendor_stock = [];
    for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
      jsonData.vendor_stock.push({ _id: x._id, name: x.name, stock: 0 });
    }
    if(this.primary_tax) jsonData.taxrate_id = this.primary_tax;
    if(this.productForm.sku?.split("-")[0]) {
      jsonData.sku = this.productForm.sku.split("-")[0];
      let newSku = this.commonService.SKUFormat(jsonData.variants);      
      if(newSku) jsonData.sku += '-'+newSku;
    }
    if(existVariantList.length) {
      jsonData.weight = 0;
      let firstVarData = existVariantList[0];
      if(firstVarData.stock) jsonData.stock = firstVarData.stock;
      if(firstVarData.weight) jsonData.weight = firstVarData.weight;
      if(firstVarData.taxrate_id) jsonData.taxrate_id = firstVarData.taxrate_id;
      if(firstVarData.selling_price) jsonData.selling_price = firstVarData.selling_price;
      if(firstVarData.discounted_price) jsonData.discounted_price = firstVarData.discounted_price;
    }
    else jsonData.weight = 1;
    return jsonData;
  }

  timePicker(i, j, variable) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.productForm.available_days[i].opening_hrs[j][variable] = this.commonService.timeConversion(time);
    });
  }

  onAddCatalog() {
    this.intForm.seo_details = {}; this.intForm.seo_status = true;
    if(!this.intForm.social_media_status) this.intForm.social_media_links = [];
    if(!this.intForm.content_status) this.intForm.content_details = {};
    this.intForm.name = this.titleCase.transform(this.intForm.name.trim());
    if(this.intForm.name) {
      this.intForm.seo_details.page_url = this.commonService.urlFormat(this.intForm.name);
      let tempName = this.intForm.name.substring(0, 70);
      this.intForm.seo_details.h1_tag = tempName;
      this.intForm.seo_details.page_title = 'Buy '+tempName;
      this.api.ADD_CATALOG(this.intForm).subscribe(result => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.api.CATALOG_LIST().subscribe(result => {
            if(result.status) {
              this.commonService.catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
              this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);
              this.commonService.catalog_list.forEach(element => {
                element.selected = false;
                if(this.categoryList.findIndex(obj => obj.selected && obj._id==element._id) != -1) element.selected = true;
              });
              this.categoryList = this.commonService.catalog_list;
            }
            else console.log("response", result);
          });
        }
        else {
          this.intForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  onUpdateTag() {
    let formData = { _id: this.intForm.selected_tag._id, option_list: this.intForm.option_list };
    this.peApi.UPDATE_TAG(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newTagIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newTagIndex!=-1) {
          let updatedOptList = result.list[newTagIndex].option_list;
          updatedOptList.forEach(element => {
            let optIndex = this.intForm.selected_tag.option_list.findIndex(obj => obj.tag_option_checked && obj.name==element.name);
            if(optIndex!=-1) element.tag_option_checked = true;
          });
          let tIndex = this.tagList.findIndex(obj => obj._id==formData._id);
          if(tIndex!=-1) this.tagList[tIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  onUpdateNote() {
    let formData = { _id: this.intForm.selected_note._id, option_list: this.intForm.option_list };
    this.peApi.UPDATE_FOOTNOTE(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        let newNoteIndex = result.list.findIndex(obj => obj._id==formData._id);
        if(newNoteIndex!=-1) {
          let updatedOptList = result.list[newNoteIndex].option_list;
          let nIndex = this.noteList.findIndex(obj => obj._id==formData._id);
          if(nIndex!=-1) this.noteList[nIndex].option_list = updatedOptList;
        }
      }
      else {
				this.intForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  brochChangeListener(files: FileList) {
    this.productForm.brochure = null;
    this.brochForm.broch_change = true;
    this.brochForm.src = files[0];
  }
  tnChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      reader.onload = (event: ProgressEvent) => {
        this.videoForm.image = (<FileReader>event.target).result;
        this.videoForm.img_file = fileData;
        this.videoForm.img_change = true;
      }
      reader.readAsDataURL(fileData);
    }
  }
  videoChangeListener(event) {
    delete this.videoForm.vid_err_msg;
    if(event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      reader.onload = (event: ProgressEvent) => {
        if(fileInKB<=this.videoLimitInKB) {
          this.videoForm.src = (<FileReader>event.target).result;
          this.videoForm.src_file = fileData;
          this.videoForm.video_change = true;
        }
        else this.videoForm.vid_err_msg = true;
      }
      reader.readAsDataURL(fileData);
    }
  }

  parseToFloat(num, index) {
    if(!Number(num)) num = 0;
    if(num) {
      if(index != null) {
        this.productForm.variant_list[index].weight = parseFloat(num);
      }
      else this.productForm.weight = parseFloat(num);
    }
  }
  onChangeTitle(sku) {
    // if(!sku) sku = '';
    // this.productForm.seo_details.page_url = this.commonService.urlFormat(this.productForm.name+' '+sku);
    // let tempName = this.productForm.name?.substring(0, 70);
    // this.productForm.seo_details.h1_tag = tempName;
    // this.productForm.seo_details.page_title = 'Buy '+tempName;
  }
  onChangeDesc() {
    // let descChars = this.commonService.stripHtml(this.productForm.description);
    // if(this.productForm.sku) {
    //   this.productForm.seo_details.meta_desc = descChars+" Product code is "+this.productForm.sku+".";
    // } 
    // if(descChars.length > 320) {
    //   this.productForm.seo_details.meta_desc = descChars.substring(0, 320);
    // }
  }

  openWebsite() {
    window.open(this.commonService.store_details?.base_url+this.productUrl);
  }

}