import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { DeploymentService } from '../deployment/deployment.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [SharedAnimations]
})

export class ProductsComponent implements OnInit {

  btnLoader: boolean; pageLoader: boolean; globalCount: number = 0;
  totalPages: number = 0; pagesList: any = [];
	page = 1; pageSize = 10;
  list: any = []; totalCount: number = 0;
  filterForm: any = {
    search: "", sort_by: 'created_desc', category_id: 'all',
    vendor_id: 'all', product_type: 'all'
  };
  sortList : any = [
    { name : "Sort by", value : "null" },
    { name : "Rank: Low to High", value : "rank" },
    { name : "Rank: High to Low", value : "rank_desc" },
    { name : "Price: Low to High", value : "discounted_price" },
    { name : "Price: High to Low", value : "price_desc" },
    { name : "Stock: Low to High", value : "stock" },
    { name : "Stock: High to Low", value : "stock_desc" },
    { name : "Created on: Earliest to Latest", value : "created_on" },
    { name : "Created on: Latest to Earliest", value : "created_desc" },
    { name : "Modified on: Earliest to Latest", value : "modified_on" },
    { name : "Modified on: Latest to Earliest", value : "modified_desc" },
    { name : "Name", value : "name" }
  ];
  exportLoader: boolean; scrollPos: number = 0;
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  limitedProdCount = environment.limited_product_count;
  selectedItem: any; tempFilter: any = {};
  categoryList: any = [{_id: 'all', name: "All Products"}, {_id: 'unlink', name: "Unlinked Products"}]; vendorList: any = [];
  // for product export
  exportTriggered: boolean;
  taxonomyList: any = []; addonList: any = []; tagList: any = [];
  taxRates: any = []; sizeCharts: any = []; imgTagList: any = [];
  allSelected: boolean; deleteForm: any = {}; selectedList: any = [];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private storeApi: StoreApiService, private deployApi: DeploymentService,
    private router: Router, private excelService: ExcelService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    // vendors
    if(this.commonService.vendor_list.length) {
      this.vendorList = [{_id: 'all', company_details: { brand: "All Vendors" }}];
      this.commonService.vendor_list.sort((a, b) => 0 - (a.company_details?.brand > b.company_details?.brand ? -1 : 1)).forEach(obj => { this.vendorList.push(obj) });
    }
    // catalogs
    if(this.commonService.catalog_list.length) {
      this.commonService.catalog_list.forEach(element => {
        this.categoryList.push(element)
      });
    }
    if(this.commonService.store_details?._id==environment.config_data.chettinad_id) {
      this.sortList.push(
        { name : "Like: Low to High", value : "wl_count"},
        { name : "Like: High to Low", value : "wl_count_desc"}
      );
    }
    if(this.commonService.store_details._id == environment.config_data.chettinad_id) {
      this.filterForm.sort_by = "modified_desc";
    }
  }
  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }   
    this.selectedItem = "bytype";
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  
  ngOnInit() {
    // if(this.commonService.route_permission_list.indexOf('catalogs')!=-1) {
    //   if(this.commonService.previous_route.indexOf("/product-sections/products")==-1 && this.commonService.previous_route!='/') {
    //     sessionStorage.setItem("ppr", this.commonService.previous_route);
    //   }
    //   this.commonService.redirect = "/product-sections/catalogs";
    //   if(sessionStorage.getItem("ppr")) this.commonService.redirect = sessionStorage.getItem("ppr");
    //   this.commonService.secondary_header = "Products";
    // }
    this.pageLoader = true; this.page = 1; this.list = [];
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    if(this.commonService.selected_catalog) {
      this.filterForm.category_id = this.commonService.selected_catalog;
      delete this.commonService.selected_catalog;
    }
    if(this.commonService.vendor_details._id) this.filterForm.vendor_id = this.commonService.vendor_details._id;
    if(this.commonService.product_page_attr) {
      let pageInfo = this.commonService.product_page_attr;
      this.page = pageInfo.page;
      this.scrollPos = pageInfo.scroll_pos;
      this.filterForm = pageInfo.filter_form;
      if(pageInfo.filter_form.from_date) this.filterForm.from_date = new Date(pageInfo.filter_form.from_date);
      if(pageInfo.filter_form.to_date) this.filterForm.to_date = new Date(pageInfo.filter_form.to_date);
      delete this.commonService.product_page_attr;
    }
    this.getProductList();
  }

  openpage() {
    if((this.commonService.ys_features?.indexOf('limited_products')==-1) || (this.globalCount < this.limitedProdCount)) {
      let prodcount = this.globalCount + 1;
      this.router.navigate(["/product-sections/products/add/"+prodcount]);    
    }
    else document.getElementById("openCommonUpgradeModal").click();
  }

  getProductList() {
    this.filterForm.skip = (this.page-1)*this.pageSize; this.filterForm.limit = this.pageSize;
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
    }    
    this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {  
      if(result.status) {
        this.list = result.list;
        this.totalCount = result.count;
        this.totalPages = Math.ceil(this.totalCount/this.pageSize);
        this.pagesList = new Array(this.totalPages);
        this.globalCount = result.product_count;
        if(this.selectedList.length) {
          this.allSelected = true;
          this.list.map(obj => {
            if(this.selectedList.findIndex(x => x._id==obj._id) != -1) obj.isSelected = true;
            else this.allSelected = false;
          });
        }
        if(this.commonService.store_details?.login_type=='branch') {
          this.list.forEach(el => {
            el.stock = el.vendor_stock.find(x => x._id.toString()==this.commonService.store_details?.login_id)?.stock || 0;
          });
        }
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
    });
  }

  onChangePage(type) {
    this.commonService.pageTop(0);
    if(type=='prev') this.page--;
    else this.page++;
    this.getProductList();
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

  goModifyPage(product) {
    if(this.commonService.subuser_features.indexOf('update_product') != -1) {
      this.commonService.product_page_attr = { page: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
      if(product) this.router.navigate(["/product-sections/products/modify/"+product._id+"/"+this.globalCount]);
    }
  }
  goReviewPage(x) {
    this.commonService.product_page_attr = { page: this.page, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    this.router.navigate(["/product-sections/selected-product-reviews/"+x._id]);
  }

  exportAsXLSX() {
    this.exportLoader = true;
    delete this.filterForm.skip; delete this.filterForm.limit;
    if(!this.exportTriggered) {
      this.exportTriggered = true;
      this.storeApi.PRODUCT_FEATURES().subscribe(result => {
        if(result.status) {
          this.addonList = result.data.addon_list.filter(obj => obj.status=='active');
          this.tagList = result.data.tag_list.filter(obj => obj.status=='active');
          this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
          this.imgTagList = result.data.img_tag_list;
          this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
          this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
          this.exportCont();
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    }
    else this.exportCont();
  }
  exportCont() {
    this.storeApi.PRODUCT_LIST(this.filterForm).subscribe(result => {
      if(result.status) {
        let attributes: any = { max_images: 0, max_tags: 0, max_fn: 0 };
        for(let el of result.list) {
          if(el.image_list.length > attributes.max_images) attributes.max_images = el.image_list.length;
          if(el.tag_status && el.tag_list.length > attributes.max_tags) attributes.max_tags = el.tag_list.length;
          if(el.footnote_list.length > attributes.max_fn) attributes.max_fn = el.footnote_list.length;
        }
        this.createList(attributes, result.list).then((exportList: any[]) => {
          this.excelService.exportAsExcelFile(exportList, 'product'+' export '+new Date().getTime());
          setTimeout(() => { this.exportLoader = false; }, 500);
        });
      }
      else {
        console.log("response", result);
        setTimeout(() => { this.exportLoader = false; }, 500);
      }
    });
  }
  async createList(attributes, productList) {
    let updatedList = [];
    for(let prod of productList) {
      let sendData = {};
      let catList = [];
      if(prod.category_id?.length) {
        for(let el of prod.category_id) {
          let cInd = this.commonService.catalog_list.findIndex(obj => obj._id==el);
          if(cInd!=-1) catList.push(this.commonService.catalog_list[cInd].name);
        }
      }
      sendData['catalogs'] = catList.join(', ');
      sendData['name'] = prod.name;
      sendData['unit'] = prod.unit;
      sendData['brand'] = "";
      if(prod.brand) sendData['brand'] = prod.brand;
      sendData['taxonomy'] = "";
      if(prod.taxonomy_id) {
        let tInd = this.taxonomyList.findIndex(tn => tn._id == prod.taxonomy_id);
        if(tInd!=-1) sendData['taxonomy'] = this.taxonomyList[tInd].name;
      }
      sendData['description'] = prod.description;
      sendData['discount'] = "No";
      if(prod.disc_status) sendData['discount'] = "Yes";
      sendData['hsn_code'] = "";
      if(prod.hsn_code) sendData['hsn_code'] = prod.hsn_code;
      sendData['search_keywords'] = "";
      if(prod.search_terms) sendData['search_keywords'] = prod.search_terms;
      sendData['featured_product'] = "No";
      if(prod.featured) sendData['featured_product'] = "Yes";
      sendData['allow_cod'] = "No";
      if(prod.allow_cod) sendData['allow_cod'] = "Yes";
      // images
      if(!sendData['product_image_1']) {
        for(let i=1; i<=attributes.max_images; i++) {
          sendData['product_image_'+i] = "";
        }
      }
      let imgPos = 0;
      for(let i=0; i<prod.image_list.length; i++) {
        if(prod.image_list[i].image) {
          imgPos++;
          sendData['product_image_'+imgPos] = prod.image_list[i].image;
        }
      }
      // variants schema
      for(let i=1; i<=3; i++) {
        sendData['variant_'+i+'_name'] = "";
        sendData['variant_'+i+'_value'] = "";
      }
      for(let i=1; i<=10; i++) {
        sendData['variant_image_'+i] = "";
      }
      sendData['sku'] = prod.sku;
      sendData['selling_price'] = prod.selling_price;
      sendData['discounted_price'] = prod.discounted_price;
      if(!prod.stock) prod.stock = 0;
      sendData['stock'] = prod.stock;
      if(!prod.weight) prod.weight = 0;
      sendData['shipping_weight'] = prod.weight;
      sendData['tax_percentage'] = "";
      if(prod.taxrate_id) {
        let tInd = this.taxRates.findIndex(tn => tn._id == prod.taxrate_id);
        if(tInd!=-1) sendData['tax_percentage'] = this.taxRates[tInd].igst;
      }
      let addonData = [];
      if(prod.addon_status && prod.addon_list?.length) {
        for(let adon of prod.addon_list) {
          let tInd = this.addonList.findIndex(tn => tn._id == adon.addon_id);
          if(tInd!=-1) addonData.push(this.addonList[tInd].name);
        }
      }
      sendData['add_ons'] = addonData.join(', ');
      sendData['addon_mandatory'] = "No";
      if(prod.addon_must) sendData['addon_mandatory'] = "Yes";
      sendData['size_chart'] = "";
      if(prod.chart_status && prod.chart_id) {
        let tInd = this.sizeCharts.findIndex(tn => tn._id == prod.chart_id);
        if(tInd!=-1) sendData['size_chart'] = this.sizeCharts[tInd].name;
      }
      let imgTags = [];
      if(prod.badge_list?.length) {
        for(let ib of prod.badge_list) {
          let tInd = this.imgTagList.findIndex(tn => tn._id == ib);
          if(tInd!=-1) imgTags.push(this.imgTagList[tInd].name);
        }
      }
      sendData['image_tags'] = imgTags.join(', ');
      // product tags
      if(!sendData['tag_1_name']) {
        for(let i=1; i<=attributes.max_tags; i++) {
          sendData['tag_'+i+'_name'] = "";
          sendData['tag_'+i+'_value'] = "";
        }
      }
      if(prod.tag_status) {
        let tagPos = 0;
        for(let i=0; i<prod.tag_list.length; i++) {
          let tagId = Object.keys(prod.tag_list[i])[0];
          let tInd = this.tagList.findIndex(tn => tn._id == tagId);
          if(tInd!=-1) {
            tagPos++;
            sendData['tag_'+tagPos+'_name'] = this.tagList[tInd].name;
            sendData['tag_'+tagPos+'_value'] = prod.tag_list[i][tagId].join(', ');
          }
        }
      }
      // foot note
      if(!sendData['footnote_1_name']) {
        for(let i=1; i<=attributes.max_fn; i++) {
          sendData['footnote_'+i+'_name'] = "";
          sendData['footnote_'+i+'_value'] = "";
        }
      }
      for(let i=0; i<prod.footnote_list.length; i++) {
        sendData['footnote_'+(i+1)+'_name'] = prod.footnote_list[i].name;
        sendData['footnote_'+(i+1)+'_value'] = prod.footnote_list[i].value;
      }
      // update variants
      let vList = [];
      if(prod.variant_status) {
        if(prod.variant_types.length===1) {
          let var1Name = prod.variant_types[0].name;
          for(let v1o of prod.variant_types[0].options)
          {
            let var1Opt = v1o.value;
            let vInd = prod.variant_list.findIndex(el => el[var1Name]==var1Opt);
            if(vInd!=-1) {
              let objData = { variant_1_name: var1Name, variant_1_value: var1Opt };
              objData = this.processVarObject(prod.variant_list[vInd], objData, prod);
              vList.push(objData);
            }
          }
        }
        else if(prod.variant_types.length===2) {
          let var1Name = prod.variant_types[0].name;
          let var2Name = prod.variant_types[1].name;
          for(let v1o of prod.variant_types[0].options)
          {
            let var1Opt = v1o.value;
            for(let v2o of prod.variant_types[1].options)
            {
              let var2Opt = v2o.value;
              let vInd = prod.variant_list.findIndex(el => el[var1Name]==var1Opt && el[var2Name]==var2Opt);
              if(vInd!=-1) {
                let objData = {
                  variant_1_name: var1Name, variant_1_value: var1Opt, variant_2_name: var2Name, variant_2_value: var2Opt
                };
                objData = this.processVarObject(prod.variant_list[vInd], objData, prod);
                vList.push(objData);
              }
            }
          }
        }
        else if(prod.variant_types.length===3) {
          let var1Name = prod.variant_types[0].name;
          let var2Name = prod.variant_types[1].name;
          let var3Name = prod.variant_types[2].name;
          for(let v1o of prod.variant_types[0].options)
          {
            let var1Opt = v1o.value;
            for(let v2o of prod.variant_types[1].options)
            {
              let var2Opt = v2o.value;
              for(let v3o of prod.variant_types[2].options)
              {
                let var3Opt = v3o.value;
                let vInd = prod.variant_list.findIndex(el => el[var1Name]==var1Opt && el[var2Name]==var2Opt && el[var3Name]==var3Opt);
                if(vInd!=-1) {
                  let objData = {
                    variant_1_name: var1Name, variant_1_value: var1Opt, variant_2_name: var2Name, variant_2_value: var2Opt,
                    variant_3_name: var3Name, variant_3_value: var3Opt
                  };
                  objData = this.processVarObject(prod.variant_list[vInd], objData, prod);
                  vList.push(objData);
                }
              }
            }
          }
        }
        if(vList.length) {
          for(let j=0; j<vList.length; j++) {
            if(j===0) {
              for(let key in vList[0]) {
                if(vList[0].hasOwnProperty(key)) sendData[key] = vList[0][key];
              }
              updatedList.push(sendData);
            }
            else updatedList.push(vList[j]);
          }
        }
      }
      else updatedList.push(sendData);
    }
    return updatedList;
  }

  processVarObject(vData, objData, prodData) {
    if(vData.image_list?.length) {
      let imgPos = 0;
      for(let imgData of vData.image_list) {
        if(imgData.image) {
          imgPos++;
          objData['variant_image_'+imgPos] = imgData.image;
        }
      }
    }
    if(!vData.sku) vData.sku = prodData.sku;
    if(!vData.stock) vData.stock = 0;
    if(!vData.weight) vData.weight = 0;
    objData['sku'] = vData.sku;
    objData['selling_price'] = vData.selling_price;
    objData['discounted_price'] = vData.discounted_price;
    objData['stock'] = vData.stock;
    objData['shipping_weight'] = vData.weight;
    objData['tax_percentage'] = "";
    if(vData.taxrate_id) {
      let tInd = this.taxRates.findIndex(tn => tn._id == vData.taxrate_id);
      if(tInd!=-1) objData['tax_percentage'] = this.taxRates[tInd].igst;
    }
    return objData;
  }

  selectAll(x) {
    this.list.map(p => { p.isSelected = x; this.onSelect(p); });
  }
  onSelect(x) {
    let index = this.selectedList.findIndex(el => el._id==x._id);
    if(index!=-1) {
      if(!x.isSelected) this.selectedList.splice(index, 1);
      this.checkAllSelect();
    }
    else {
      if(x.isSelected) {
        this.selectedList.push({ _id: x._id, sku: x.sku }); 
        this.checkAllSelect();
      }
    }
  }
  checkAllSelect() {
    this.allSelected = true;
    if(this.list.findIndex(el => !el.isSelected) != -1) this.allSelected = false;
  }

  onOpenDeleteModal(modalName) {
    this.deleteForm = { skuList: [], ids: [] };
    this.selectedList.map(obj => {
      this.deleteForm.skuList.push(obj.sku);
      this.deleteForm.ids.push(obj._id);
    });
    this.modalService.open(modalName);
  }
  onDelete() {
    this.deleteForm.submit = true;
    if(this.deleteForm.ids?.length === 1) {
      this.storeApi.DELETE_PRODUCT({ _id: this.deleteForm.ids[0] }).subscribe(result => {
        this.deleteForm.submit = false;
        if(result.status) {
          this.allSelected = false;
          this.selectedList = [];
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.deleteForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else if(this.deleteForm.ids?.length > 1) {
      this.storeApi.BULK_PRODUCT_DELETE({ ids: this.deleteForm.ids }).subscribe((result) => {
        this.deleteForm.submit = false;
        if(result.status) {
          this.allSelected = false;
          this.selectedList = [];
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.deleteForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.deleteForm.submit = false;
  }

}