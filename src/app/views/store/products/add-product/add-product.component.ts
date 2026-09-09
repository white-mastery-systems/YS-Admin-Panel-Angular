import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { StoreApiService } from '../../../../services/store-api.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { FeaturesApiService } from '../../features/features-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class AddProductComponent implements OnInit {

  maxRank: any = 0; intForm: any = {};
  productForm: any; existVariantList: any = [];
  pageLoader: boolean; btnLoader: boolean; categoryList: any = [];
  addonList: any; tagList: any; noteList: any; taxRates: any; colorList: any; amenityList: any;
  sizeCharts: any; faqList: any; aiStyleList: any; imgTagList: any; taxonomyList: any; hlList: any;
  imageIndex: any; imgWidth: any; imgHeight: any; primary_tax: any;
  image_count: number = environment.default_img_count;
  selectedVariantOptions: any []; selectedVariantIndex: number;
  configData: any= environment.config_data; brochForm: any = {};
  catSearch: string; productFeatures: any; vendorAdmin: boolean;
  selectedImage: any; croppedImage: any = {}; cropStatus: boolean;
  varIndex: number; imgIndex: number; resizeForm: any = {}; imgType: string;
  videoForm: any = {}; videoLimitInKB: number = 10240; // 6144
  imageForm: any = { list: [] };
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
      this.commonService.secondary_header = "Add Product";
      this.aiStyleList = []; delete this.catSearch;
      this.categoryList = this.commonService.catalog_list;
      if(this.commonService.ys_features.indexOf('vendors')!=-1 && this.commonService.store_details?.login_type!='vendor') this.vendorAdmin = true;
      if(localStorage.getItem("aistyle_list")) this.aiStyleList = this.commonService.decryptData(localStorage.getItem("aistyle_list"));
      this.categoryList.forEach(element => { element.selected = false; });
      if(this.commonService.ys_features.indexOf('variant_image_tag')!=-1) this.image_count = environment.variant_img_count;
      this.maxRank = params.rank; this.btnLoader = false; this.pageLoader = true;
      this.productForm = {
        rank: this.maxRank, image_list: [], variant_types: [], seo_details: {}, unit: 'Pcs', disc_range: [], vendor_stock: [],
        allow_cod: true, available_days: [
          { code: 0, day: "Sunday", active: false, opening_hrs: [] }, { code: 1, day: "Monday", active: false, opening_hrs: [] },
          { code: 2, day: "Tuesday", active: false, opening_hrs: [] }, { code: 3, day: "Wednesday", active: false, opening_hrs: [] },
          { code: 4, day: "Thursday", active: false, opening_hrs: [] }, { code: 5, day: "Friday", active: false, opening_hrs: [] },
          { code: 6, day: "Saturday", active: false, opening_hrs: [] }
        ], stock_type: "lim", origin: this.commonService.store_details?.country, meta_data: {}, weight: 1
      };
      if(this.commonService.store_details.type=='estates') {
        this.productForm.stock = 100;
      }
      if(this.commonService.store_details?._id == environment.config_data.chettinad_id) {
        delete this.productForm.weight;
        this.productForm.disc_status = true;
        this.productForm.addon_status = true;
        this.productForm.tag_status = true;
        this.productForm.note_status = true;
      }
      // auto sku
      if(this.commonService.deploy_details?.auto_sku && this.commonService.deploy_details?.sku_config?.min_digit) {
        let prodCount = 0;
        this.api.PRODUCTS_COUNT().subscribe(result => {
          if(result.status) prodCount = result.count;
          let numConvert = String(prodCount+1).padStart(this.commonService.deploy_details.sku_config.min_digit, '0');
          this.productForm.sku = this.commonService.skuFormat(this.commonService.deploy_details.sku_config.prefix+numConvert);
        });
      }
      // product features
      this.addonList = []; this.tagList = []; this.noteList = [];
      this.taxRates = []; this.sizeCharts = []; this.taxonomyList = []; this.hlList = [];
      this.api.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          this.productFeatures = result.data;
          if(this.commonService.route_permission_list.indexOf('addon_products') == -1) {
            this.addonList = result.data.addon_list.filter(obj => obj.status=='active');
          }
          this.tagList = result.data.tag_list.filter(obj => obj.status=='active');
          this.amenityList = result.data.amenities.filter(obj => obj.status=='active');
          this.faqList = result.data.faq_list.filter(obj => obj.status=='active');
          this.hlList = result.data.nearby.filter(obj => obj.status=='active');
          this.noteList = result.data.footnote_list;
          this.imgTagList = result.data.img_tag_list;
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          // for vendor login
          if(this.commonService.store_details?.login_type=='vendor') this.onChangeVendor(this.commonService.vendor_details._id);
          // common features
          if(this.commonService.ys_features.indexOf('tax_rates')!=-1) {
            this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
            if(this.taxRates.length) {
              let taxIndex = this.taxRates.findIndex(obj => obj.primary);
              if(taxIndex!=-1) {
                this.primary_tax = this.taxRates[taxIndex]._id;
                this.productForm.taxrate_id = this.primary_tax;
              }
            }
          }
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          if(this.taxonomyList.length) {
            let tIndex = this.taxonomyList.findIndex(obj => obj.primary);
            if(tIndex!=-1) this.productForm.taxonomy_id = this.taxonomyList[tIndex]._id;
            else this.productForm.taxonomy_id = this.taxonomyList[0]._id;
          }
          this.colorList = result.data.color_list;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
      // get multi addon list
      if(this.commonService.route_permission_list.indexOf('addon_products') != -1) {
        this.onGetMultiAddon();
      }
      if(this.commonService.ys_features.indexOf('shopping_assistant')!=-1 && !localStorage.getItem("aistyle_list")) {
        this.peApi.AI_STYLE_DETAILS().subscribe(result => {
          if(result.status) {
            this.commonService.aistyle_list = result.data;
            this.aiStyleList = this.commonService.aistyle_list;
            this.commonService.updateLocalData('aistyle_list', this.commonService.aistyle_list);
          }
        });
      }
      if(this.commonService.ys_features.indexOf('recipes')!=-1) {
        if(!localStorage.getItem("recipe_list")) {
          this.fApi.RECIPE_LIST().subscribe(result => {
            if(result.status) {
              this.commonService.recipe_list = [];
              for(let x of result.list) {
                this.commonService.recipe_list.push({ _id: x._id, name: x.name });
              }
              this.commonService.updateLocalData('recipe_list', this.commonService.recipe_list);
            }
          });
        }
        else this.commonService.recipe_list.forEach(el => { delete el.recipe_checked; });
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
			if(result.status) this.addonList = result.list;
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

  onAdd() {
    this.fileList = new FormData();
    this.btnLoader = true;
    delete this.productForm.errorMsg;
    // category list
    this.productForm.category_id = []; this.productForm.category_timestamp = [];
    this.productForm.category_name = "";
    this.categoryList.forEach(element => {
      if(element.selected) {
        this.productForm.category_id.push(element._id);
        this.productForm.category_timestamp.push({ cat_id: element._id });
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
    if(this.commonService.ys_features.indexOf('limited_products')!=-1) this.productForm.limited_products = environment.limited_product_count;
    if(!this.productForm.image_tag_status) {
      this.productForm.image_list.forEach(obj => { delete obj.tag; });
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
    if(!this.productForm.image_list.length) this.productForm.image_list = [{}];
    // delete this.productForm.video_details;
    // add product
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
          let el:HTMLElement = document.getElementById(errData.id)
          let topPosition = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: topPosition - 100, behavior: 'smooth' }); 
          this.commonService.toastMsg = errData.message;
          this.commonService.toastErr = true;
          this.commonService.clearToast(10000)
        } 
        else this.callApi();
      }
      else this.callApi();
    }
  }

  async callApi() {
    if(this.videoForm.img_change && this.videoForm.img_file) this.fileList.append('thumbnail', this.videoForm.img_file);
    if(this.videoForm.video_change && this.videoForm.src_file) this.fileList.append('video', this.videoForm.src_file);
    if(this.brochForm.broch_change && this.brochForm.src) this.fileList.append('brochure', this.brochForm.src);
    let formData: any = {};
    for(let key in this.productForm) {
      if (this.productForm.hasOwnProperty(key)) formData[key] = this.productForm[key];
    }
    if(formData.image_list?.length) formData.image_list = await this.onContSetFormData(formData.image_list, 'product');
    if(formData.variant_status && formData.variant_list?.length) formData.variant_list = await this.onContSetFormData(formData.variant_list, 'variant');
    this.fileList.append('data', JSON.stringify(formData));
    this.api.ADD_PRODUCT(this.fileList).subscribe(result => {
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
    this.addonList = vInfo.addon_list.filter(obj => obj.status=='active');
    this.faqList = vInfo.faq_list.filter(el => el.status=='active');
    this.sizeCharts = vInfo.size_chart.filter(el => el.status=='active');
    this.noteList = vInfo.footnote_list;
  }
  setVendorProdTag(vendorId) {
    this.tagList = [];
    this.productFeatures.tag_list.filter(obj => obj.status=='active').forEach(obj => {
      obj.option_list = [];
      let vtIndex = obj.vendor_list.findIndex(v => v.vendor_id==vendorId);
      if(vtIndex!=-1) {
        obj.option_list = obj.vendor_list[vtIndex].option_list;
        this.tagList.push(obj);
      }
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
      jsonData.vendor_stock = [];
      for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
        jsonData.vendor_stock.push({ _id: x._id, name: x.name, stock: 0 });
      }
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
        jsonData.vendor_stock = [];
        for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
          jsonData.vendor_stock.push({ _id: x._id, name: x.name, stock: 0 });
        }
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
          jsonData.vendor_stock = [];
          for(let x of this.commonService.store_branch_list.filter(el => el.selected)) {
            jsonData.vendor_stock.push({ _id: x._id, name: x.name, stock: 0 });
          }
          this.productForm.variant_list.push(jsonData);
        });
      });
    });
    this.existVariantList = this.productForm.variant_list;
  }

  varEventOne(existVariantList, varIndex, jsonData) {
    jsonData.sku = existVariantList[varIndex].sku;
    if(this.productForm.sku) {
      jsonData.sku = this.productForm.sku;
      let newSku = this.commonService.SKUFormat(jsonData.variants);      
      if(newSku) jsonData.sku += '-'+newSku;
    }
    jsonData.stock = 0; jsonData.weight = 1; jsonData.image_list = [];
    // selling_price
    if(existVariantList[varIndex].selling_price) jsonData.selling_price = existVariantList[varIndex].selling_price;
    else if(existVariantList[0].selling_price) jsonData.selling_price = existVariantList[0].selling_price;
    // discounted price
    if(existVariantList[varIndex].discounted_price) jsonData.discounted_price = existVariantList[varIndex].discounted_price;
    else if(existVariantList[0].discounted_price) jsonData.discounted_price = existVariantList[0].discounted_price;
    // stock
    if(existVariantList[varIndex].stock) jsonData.stock = existVariantList[varIndex].stock;
    else if(existVariantList[0].stock) jsonData.stock = existVariantList[0].stock;
    // weight
    if(existVariantList[varIndex].weight) jsonData.weight = existVariantList[varIndex].weight;
    else if(existVariantList[0].weight) jsonData.weight = existVariantList[0].weight;
    // taxrate id
    if(existVariantList[varIndex].taxrate_id) jsonData.taxrate_id = existVariantList[varIndex].taxrate_id;
    if(!jsonData.taxrate_id && this.primary_tax) jsonData.taxrate_id = this.primary_tax;
    // image list
    if(existVariantList[varIndex].image_list) jsonData.image_list = existVariantList[varIndex].image_list;
    return jsonData;
  }
  varEventTwo(existVariantList, jsonData) {
    jsonData.stock = 0;
    if(this.primary_tax) jsonData.taxrate_id = this.primary_tax;
    if(this.productForm.sku) {
      jsonData.sku = this.productForm.sku;
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

  changeVariantNameSelect(x) {
    delete x.name;
    if(x.variant_names!='custom_name') x.name = x.variant_names;
    this.onCreateVariantList(this.productForm.variant_types);
  }

  brochChangeListener(files: FileList) {
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
    if(this.commonService.store_details?._id==this.configData.chettinad_id) {
      if(!this.selectedTags?.length) this.prevProdName = this.productForm.name;
      else {
        const colorTags = this.selectedTags.filter(tag => tag.type === "Color").map(tag => tag.name);
        const designTags = this.selectedTags.filter(tag => tag.type === "Design").map(tag => tag.name);
        this.prevProdName = this.productForm.name.split([...colorTags, ...designTags].filter(Boolean).join(' '))[1].slice(1) || '';
        this.productForm.name = [...colorTags, ...designTags, this.prevProdName].filter(Boolean).join(' ');
      }
    }
    
    if(!sku) sku = '';
    this.productForm.seo_details.page_url = this.commonService.urlFormat(this.productForm.name+' '+sku);
    let tempName = this.productForm.name?.substring(0, 70);
    this.productForm.seo_details.h1_tag = tempName;
    this.productForm.seo_details.page_title = 'Buy '+tempName;
  }
  onChangeDesc() {
    let descChars = this.commonService.stripHtml(this.productForm.description);
    if(this.productForm.sku) {
      this.productForm.seo_details.meta_desc = descChars+" Product code is "+this.productForm.sku+".";
    }
    if(descChars.length > 320) {
      this.productForm.seo_details.meta_desc = descChars.substring(0, 320);
    }
  }

  selectedTags: any = []; prevProdName: any;
  onSelectTags(data, value) {
    if (data.name === "Color" || data.name === "Design") {
      if (value.tag_option_checked) {
        if (!this.selectedTags.includes(value.name)) this.selectedTags.push({ name: value.name, type: data.name });
      } 
      else this.selectedTags = this.selectedTags.filter(tag => tag.name !== value.name);
  
      const colorTags = this.selectedTags.filter(tag => tag.type === "Color").map(tag => tag.name);
      const designTags = this.selectedTags.filter(tag => tag.type === "Design").map(tag => tag.name);
      
      this.productForm.name = [...colorTags, ...designTags, this.prevProdName].filter(Boolean).join(' ');
      this.onChangeTitle(this.productForm.sku)
      
      if (!this.productForm.search_keywords?.length) this.productForm.search_keywords = [];
  
      const keywordIndex = this.productForm.search_keywords.findIndex(el => el.value === data.name);
      const isAnyOptionChecked = data.option_list.some(el => el.tag_option_checked);
  
      if (keywordIndex === -1 && isAnyOptionChecked) this.productForm.search_keywords.push({ display: data.name, value: data.name });
      else if (keywordIndex !== -1 && !isAnyOptionChecked) this.productForm.search_keywords.splice(keywordIndex, 1);
    }
  }

}