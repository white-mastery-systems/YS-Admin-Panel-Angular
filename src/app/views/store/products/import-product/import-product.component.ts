import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { ProductExtrasApiService } from '../../product-extras/product-extras-api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.scss']
})
export class ImportProductComponent implements OnInit {

  pageLoader: boolean; btnLoader: boolean; errorMsg: string;
  productList: any = []; skuList: any = []; taxonomyList: any = [];
  addonList: any = []; tagList: any = []; noteList: any = []; addonProducts: any = [];
  taxRates: any = []; sizeCharts: any = []; imgTagList: any = [];
  parentTagList: any = []; vendorId: string = ''; fileName: string;
  alphaArr: any = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm",
    "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"
  ];

  constructor(
    private storeApi: StoreApiService, private router: Router, public commonService: CommonService,
    private titleCase: TitleCasePipe, private peApi: ProductExtrasApiService
  ) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.commonService.redirect = "/product-sections/products";
    this.commonService.secondary_header = "Import Products";
    this.storeApi.PRODUCT_FEATURES().subscribe(result => {
      if(result.status) {
        this.addonList = result.data.addon_list.filter(obj => obj.status=='active');
        this.tagList = result.data.tag_list.filter(obj => obj.status=='active');
        this.parentTagList = result.data.tag_list.filter(obj => obj.status=='active');
        this.taxRates = result.data.tax_rates.filter(obj => obj.status=='active');
        this.noteList = result.data.footnote_list;
        this.imgTagList = result.data.img_tag_list;
        this.sizeCharts = result.data.size_chart.filter(obj => obj.status=='active');
        this.taxonomyList = result.data.taxonomy.filter(obj => obj.status=='active');
        // for vendor login
        if(this.commonService.store_details?.login_type=='vendor') {
          this.vendorId = this.commonService.vendor_details._id;
          this.onChangeVendor(this.vendorId);
        }
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    if(this.commonService.route_permission_list.indexOf('addon_products') != -1) {
      this.peApi.ADDON_PRODUCTS_LIST().subscribe(result => {
        if(result.status) this.addonProducts = result.list;
        else console.log("response", result);
      });
    }
  }

  onChangeVendor(vendorId) {
    this.setVendorProdTag(vendorId);
    this.addonList = []; this.sizeCharts = []; this.noteList = [];
    this.pageLoader = true;
    this.storeApi.VENDOR_FEATURES(vendorId).subscribe(result => {
      if(result.status) this.setVendorInfo(result.data);
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
    this.clearInput();
  }
  setVendorInfo(vInfo) {
    this.addonList = vInfo.addon_list.filter(obj => obj.status=='active');
    this.sizeCharts = vInfo.size_chart.filter(el => el.status=='active');
    this.noteList = vInfo.footnote_list;
  }
  setVendorProdTag(vendorId) {
    this.tagList = [];
    this.parentTagList.forEach(obj => {
      obj.option_list = [];
      let vtIndex = obj.vendor_list.findIndex(v => v.vendor_id==vendorId);
      if(vtIndex!=-1) {
        obj.option_list = obj.vendor_list[vtIndex].option_list;
        this.tagList.push(obj);
      }
    });
  }

  onUpload() {
    delete this.errorMsg;
    if(this.productList.length) {
      this.btnLoader = true;
      this.storeApi.PRODUCT_BULK_UPLOAD({ file_name: this.fileName, product_list: this.productList, sku_list: this.skuList }).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/product-sections/products'])
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.errorMsg = "No products found";
  }

  onFileChange(ev) {
    delete this.errorMsg;
    const reader = new FileReader();
    reader.onload = () => {
      let workBook = XLSX.read(reader.result, { type: 'binary' });
      let jsonData: any = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.findCatalog(jsonData.Sheet1);
    }
    this.fileName = ev.target.files[0]?.name;
    reader.readAsBinaryString(ev.target.files[0]);
  }

  clearInput() {
    let el: any = document.getElementById('importFile');
    if(el) el.value = "";
    this.fileName = null;
    this.productList = [];
  }

  findCatalog(dataList) {
    this.skuList = [];
    this.productList = []; let prodData: any;
    dataList.forEach((obj: any) => {
      if(obj.name) {
        prodData = {
          name: "", unit: "", brand: "", hsn_code: "", description: "", long_desc: "", featured: false, allow_cod: false,
          sku: "", stock: 0, selling_price: 0, discounted_price: 0, shipping_weight: 0, disc_status: false, disc_percentage: 0,
          seo_details: {}, image_list: [], category_id: [], category_timestamp: [], category_name: "", addon_status: false, addon_list: [], badge_list: [],
          footnote_list: [], search_terms: "", chart_status: false, tag_status: false, tag_list: [],
          variant_status: false, variant_list: [], variant_types: []
        };
        if(obj.name) prodData.name = obj.name.toString().replace(/[^\x00-\x7F]/g, " ").replace(/\s+/g, " ").trim();
        if(obj.unit) prodData.unit = obj.unit.trim();
        if(obj.brand) prodData.brand = obj.brand.toString().trim();
        if(obj.hsn_code) prodData.hsn_code = obj.hsn_code.toString().trim();
        if(obj.description) {
          prodData.description = obj.description.toString().replace(/[^\x00-\x7F]/g, " ").replace(/\s+/g, " ").trim();
          if(prodData.description && prodData.description[0]!='<') prodData.description = '<p>'+prodData.description+'</p>';
        }
        if(obj.long_description) {
          prodData.long_desc = obj.long_description.toString().trim();
          if(prodData.long_desc && prodData.long_desc[0]!='<') prodData.long_desc = '<p>'+prodData.long_desc+'</p>';
        }
        if(obj.featured_product && obj.featured_product.toLowerCase().trim()=='yes') prodData.featured = true;
        if(obj.allow_cod && obj.allow_cod.toLowerCase().trim()=='yes') prodData.allow_cod = true;

        if(obj.sku) prodData.sku = this.commonService.skuFormat(obj.sku);
        if(obj.stock) prodData.stock = parseFloat(obj.stock);
        if(obj.selling_price) prodData.selling_price = parseFloat(obj.selling_price);
        if(obj.discounted_price) prodData.discounted_price = parseFloat(obj.discounted_price);
        if(obj.shipping_weight) prodData.weight = parseFloat(obj.shipping_weight);
        if(obj.tax_percentage) {
          let tInd = this.taxRates.findIndex(el => el.igst==parseFloat(obj.tax_percentage));
          if(tInd!=-1) prodData.taxrate_id = this.taxRates[tInd]._id;
        }
        // discount
        if(obj.discount && obj.discount.toLowerCase().trim()=='yes' && prodData.selling_price && prodData.discounted_price && prodData.selling_price>prodData.discounted_price) {
          prodData.disc_status = true;
          let amtPercentage = (prodData.discounted_price/prodData.selling_price)*100;
          prodData.disc_percentage = parseFloat((100 - amtPercentage).toFixed(2));
        }
        // seo_details
        prodData.seo_status = true;
        let tempName = prodData.name.substring(0, 70);
        let defaultPageUrl = this.commonService.urlFormat(prodData.name+' '+prodData.sku);
        let defaultMetaDesc = this.commonService.stripHtml(prodData.description).substring(0, 320);
        prodData.seo_details.page_url = defaultPageUrl;
        if(obj.seo_page_url) prodData.seo_details.page_url = this.commonService.urlFormat(obj.seo_page_url.toString().trim());
        else if(obj.page_url) prodData.seo_details.page_url = this.commonService.urlFormat(obj.page_url.toString().trim());
        prodData.seo_details.h1_tag = tempName;
        if(obj.seo_h1_tag) prodData.seo_details.h1_tag = obj.seo_h1_tag.toString().trim();
        else if(obj.h1_tag) prodData.seo_details.h1_tag = obj.h1_tag.toString().trim();
        prodData.seo_details.page_title = tempName;
        if(obj.seo_page_title) prodData.seo_details.page_title = obj.seo_page_title.toString().trim();
        else if(obj.page_title) prodData.seo_details.page_title = obj.page_title.toString().trim();
        prodData.seo_details.meta_desc = defaultMetaDesc;
        if(obj.seo_meta_desc) prodData.seo_details.meta_desc = obj.seo_meta_desc.toString().trim();
        else if(obj.meta_desc) prodData.seo_details.meta_desc = obj.meta_desc.toString().trim();
        if(obj.meta_keywords) {
          obj.meta_keywords = obj.meta_keywords.toString().trim();
          prodData.seo_details.meta_keywords = obj.meta_keywords.split(', ');
        }
        // image_list
        for(let i=1; i<=10; i++) {
          if(obj['product_image_'+i]) {
            let img = obj['product_image_'+i].trim();
            if(img && prodData.image_list.findIndex(el => el.image==img)==-1) {
              prodData.image_list.push({ image: img, img_alt: prodData.seo_details.page_url+"-"+this.alphaArr[i-1] });
            }
          }
        }
        // taxonomy
        if(obj.taxonomy) {
          let tInd = this.taxonomyList.findIndex(tn => tn.name.toLowerCase().trim() == obj.taxonomy.toString().trim().toLowerCase());
          if(tInd!=-1) prodData.taxonomy_id = this.taxonomyList[tInd]._id;
        }
        // category_id
        if(this.commonService.store_details?.login_type!='vendor' || this.commonService.vendor_features.indexOf('link_product')!=-1) {
          if(obj.catalogs) {
            obj.catalogs.toString().split(',').forEach(catName => {
              catName = catName.trim().toLowerCase();
              if(catName) {
                let catData = this.commonService.catalog_list.find(i => i.name.toLowerCase().trim() == catName);
                if(catData && prodData.category_id.indexOf(catData._id)==-1) {
                  prodData.category_id.push(catData._id);
                  prodData.category_timestamp.push({ cat_id: catData._id });
                  prodData.category_name += catData.name+', ';
                }
              }
            });
            if(prodData.category_id.length) prodData.category_name = prodData.category_name.slice(0, -2);
          }
        }
        // addon_list
        if(obj.add_ons) {
          let tempAddonList = this.addonList;
          if(this.addonProducts.length) tempAddonList =this.addonProducts;
          obj.add_ons.toString().split(',').forEach(addonName => {
            addonName = addonName.trim().toLowerCase();
            if(addonName) {
              let addInd = tempAddonList.findIndex(i => i.name.toLowerCase().trim() == addonName);
              if(addInd!=-1 && prodData.addon_list.findIndex(el => el.addon_id==tempAddonList[addInd]._id)==-1) {
                prodData.addon_status = true;
                if(obj.addon_mandatory && obj.addon_mandatory.toLowerCase().trim()=='yes') prodData.addon_must = true;
                prodData.addon_list.push({ addon_id: tempAddonList[addInd]._id });
              }
            }
          });
        }
        // badge_list
        if(obj.image_tags) {
          obj.image_tags.toString().split(',').forEach(imgTag => {
            imgTag = imgTag.trim().toLowerCase();
            if(imgTag) {
              let bInd = this.imgTagList.findIndex(i=> i.name.toLowerCase().trim() == imgTag);
              if(bInd!=-1 && prodData.badge_list.indexOf(this.imgTagList[bInd]._id)==-1) {
                prodData.badge_list.push(this.imgTagList[bInd]._id);
              }
            }
          });
        }
        // footnote_list
        for(let i=1; i<=20; i++) {
          if(obj['footnote_'+i+'_name'] && obj['footnote_'+i+'_value']) {
            let elemName = obj['footnote_'+i+'_name'].toString().trim();
            let elemValue = obj['footnote_'+i+'_value'].toString().trim();
            if(elemName && elemValue) {
              let flInd = this.noteList.findIndex(el=> el.name.toLowerCase().trim() === elemName.toLowerCase());
              if(flInd!=-1) {
                let optList = this.noteList[flInd].option_list;
                let foInd = optList.findIndex(el=> el.description.toLowerCase().trim() === elemValue.toLowerCase());
                if(foInd!=-1) {
                  prodData.footnote_list.push({
                    name: this.noteList[flInd].name, rank: this.noteList[flInd].rank, value: optList[foInd].description
                  });
                }
              }
            }
          }
        }
        // search_keywords
        if(obj.search_keywords) {
          let stList = [];
          obj.search_keywords.toString().split(',').forEach(sTerm => {
            sTerm = sTerm.trim();
            if(sTerm && stList.indexOf(sTerm)==-1) stList.push(sTerm);
          });
          prodData.search_terms = stList.join(', ');
        }
        // size chart
        if(obj.size_chart) {
          let cInd = this.sizeCharts.findIndex(sc => sc.name.toLowerCase().trim() === obj.size_chart.toString().toLowerCase().trim());
          if(cInd!=-1) {
            prodData.chart_status = true;
            prodData.chart_id = this.sizeCharts[cInd]._id;
          }
        }
        // tag list
        for(let i=1; i<=20; i++) {
          if(obj['tag_'+i+'_name'] && obj['tag_'+i+'_value']) {
            let elemName = obj['tag_'+i+'_name'].toString().trim();
            let elemValue = obj['tag_'+i+'_value'].toString().trim();
            if(elemName && elemValue) {
              let tlInd = this.tagList.findIndex(el=> el.name.toLowerCase().trim() === elemName.toLowerCase());
              if(tlInd!=-1) {
                let tagOptions = [];
                let optList = this.tagList[tlInd].option_list;
                elemValue.split(',').forEach(optName => {
                  let toInd = optList.findIndex(op => op.name.toLowerCase().trim()==optName.toLowerCase().trim());
                  if(toInd!=-1) tagOptions.push(optList[toInd].name);
                });
                if(tagOptions.length) {
                  prodData.tag_status = true;
                  prodData.tag_list.push({ [this.tagList[tlInd]._id]: tagOptions });
                }
              }
            }
          }
        }
        // variant_list
        if(obj['variant_1_name']?.toString().trim()) {
          prodData.variant_status = true;
          let variantData = this.buildVariantData(prodData, obj);
          prodData.variant_list.push(variantData);
        }
        if(this.skuList.indexOf(prodData.sku) == -1) {
          if(this.vendorId) prodData.vendor_id = this.vendorId;
          if(prodData.footnote_list?.length) {
            prodData.footnote_list = prodData.footnote_list.sort((a, b) => 0 - (a.rank > b.rank ? -1 : 1));
          }
          this.productList.push(prodData);
          this.skuList.push(prodData.sku);
        }
      }
      else if(prodData?.variant_list) {
        // variant_list
        prodData.variant_status = true;
        let variantData = this.buildVariantData(prodData, obj);
        prodData.variant_list.push(variantData);
      }
    });
  }

  buildVariantData(prodData, obj) {
    let variantTypes = prodData.variant_types;
    let variantData: any = { image_list: [], variants: [], stock: 0, weight: 1 };
    for(let i=1; i<=3; i++) {
      if(obj['variant_'+i+'_name'] && obj['variant_'+i+'_value']) {
        let varName = this.titleCase.transform(obj['variant_'+i+'_name'].toString().trim());
        let varValue = this.titleCase.transform(obj['variant_'+i+'_value'].toString().trim());
        if(varName && varValue) {
          variantData[varName] = varValue;  
          variantData.variants.push(varValue);
          let vInd = variantTypes.findIndex(el => el.name==varName);
          if(vInd===-1) {
            variantTypes.push({ name: varName, options: [{ display: varValue, value: varValue }] });
          }
          else {
            let oInd = variantTypes[vInd].options.findIndex(el => el.display==varValue);
            if(oInd===-1) variantTypes[vInd].options.push({ display: varValue, value: varValue });
          }
        }
      }
    }
    if(obj.sku) variantData.sku = this.commonService.skuFormat(obj.sku);
    if(obj.stock) variantData.stock = parseFloat(obj.stock);
    if(obj.selling_price) variantData.selling_price = parseFloat(obj.selling_price);
    if(obj.discounted_price) variantData.discounted_price = parseFloat(obj.discounted_price);
    if(obj.shipping_weight) variantData.weight = parseFloat(obj.shipping_weight);
    if(obj.tax_percentage) {
      let tInd = this.taxRates.findIndex(el => el.igst==parseFloat(obj.tax_percentage));
      if(tInd!=-1) variantData.taxrate_id = this.taxRates[tInd]._id;
    }
    if(this.commonService.ys_features.indexOf('variant_image_tag_pro')!=-1) {
      for(let i=1; i<=10; i++) {
        if(obj['variant_image_'+i]) {
          let img = obj['variant_image_'+i].trim();
          if(img && variantData.image_list.findIndex(el => el.image==img)==-1) {
            variantData.image_list.push({ image: img, img_alt: prodData.seo_details.page_url+"-"+this.alphaArr[i-1] });
          }
        }
      }
    }
    return variantData;
  }

}
