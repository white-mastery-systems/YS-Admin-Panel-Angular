import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';
import { ExcelService } from '../../../services/excel.service';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
  animations: [SharedAnimations]
})

export class CatalogsComponent implements OnInit {

  page = 1; pageSize = 10; scrollPos: number = 0; globalCount: number = 0;
  list: any = []; search_bar: string; pageLoader: boolean;
  limitedProdCount = environment.limited_product_count;
  configData: any= environment.config_data;
  share : any;

  constructor(
    private datepipe: DatePipe, private router: Router, private storeApi: StoreApiService,
    public commonService: CommonService, private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.pageLoader = true;
    if(this.commonService.page_attr) {
      let pageInfo = this.commonService.page_attr;
      this.page = pageInfo.page;
      this.search_bar = pageInfo.search_bar;
      this.scrollPos = pageInfo.scroll_pos;
      delete this.commonService.page_attr;
    }
    this.storeApi.CATALOG_LIST().subscribe(result => {
      if(result.status) {
        this.list = [{ name: "All Products", product_count: result.total_products, listIndex: 0 }];
        this.globalCount = result.total_products;
        result.list.forEach((obj, index) => { obj.listIndex=index+1; this.list.push(obj); });
        this.commonService.catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
        this.commonService.updateLocalData('catalog_list', this.commonService.catalog_list);        
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos); }, 500);
    });
  }

  socialShare(pageurl, selectedIndex) {
    if(environment.keep_login) {
      Share.share({
        title: '', text: '', dialogTitle: '',
        url: this.commonService.store_details.base_url+"/"+pageurl
      });
    }
    else {
      if(!this.commonService.isDesktop) {
        let windowNav: any = window.navigator;
        if(windowNav && windowNav.share) {
          windowNav.share({
            title: '', text: '',
            url: this.commonService.store_details.base_url+"/"+pageurl
          })
          .catch( (error) => { console.log(error); });
        }
        else console.log("share not supported")
      }
      else {
        this.commonService.copyLink=false;
        this.list.forEach((el,ind) => { if(selectedIndex!=ind) delete el.share; });
        this.list[selectedIndex].share = !this.list[selectedIndex].share;
      }
    }
  }

  openpage() {
    if((this.commonService.ys_features?.indexOf('limited_products')==-1) || (this.globalCount < this.limitedProdCount)) {
      let prodcount = this.globalCount + 1;
      this.router.navigate(["/product-sections/products/add/"+prodcount]);    
    }
    else document.getElementById("openCommonUpgradeModal").click();
  }

  exportAsXLSX() {
    let exportList = [];    
    if(this.commonService.catalog_list.length) {
      this.commonService.catalog_list.forEach(el => {
        exportList.push({ "ID": el._id, "Name": el.name });
      });
      this.excelService.exportAsExcelFile(exportList, 'Catalogs '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    }
  }

  ngOnDestroy() {
    this.commonService.page_attr = { page: this.page, search_bar: this.search_bar, scroll_pos: this.commonService.scroll_y_pos };
  }

}