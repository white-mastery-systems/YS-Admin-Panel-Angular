import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { StoreApiService } from 'src/app/services/store-api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-catalogs',
  templateUrl: './import-catalogs.component.html',
  styleUrls: ['./import-catalogs.component.scss']
})

export class ImportCatalogsComponent {

  pageLoader: boolean; btnLoader: boolean; errorMsg: string;
  catalogList: any = []; fileName: string;

  constructor(
    private storeApi: StoreApiService, private router: Router, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.commonService.redirect = "/product-sections/catalogs";
    this.commonService.secondary_header = "Import Catalogs";
    setTimeout(()=>{ this.pageLoader = false; }, 500)
  }

  onUpload() {
    delete this.errorMsg;
    if(this.catalogList.length) {
      this.btnLoader = true;
      this.storeApi.CATALOG_BULK_UPLOAD({ file_name: this.fileName, catalog_list: this.catalogList }).subscribe(result => {
        this.btnLoader = false;
        if(result.status) this.router.navigate(['/product-sections/catalogs'])
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.errorMsg = "No catalogs found";
  }

  clearInput() {
    let el: any = document.getElementById('importFile');
    if(el) el.value = "";
    this.fileName = null;
    this.catalogList = [];
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

  findCatalog(catList) {
    this.catalogList = [];
    for(let data of catList) {
      let obj:any = { name: '', seo_status: true, seo_details: {} };
      if(data.Name) {
        obj.name = data.Name.trim();
        obj.seo_details.page_url = this.commonService.urlFormat(obj.name);
        let tempName = obj.name.substring(0, 70);
        obj.seo_details.h1_tag = tempName;
        obj.seo_details.page_title = 'Buy '+tempName;
      }
      this.catalogList.push(obj);
    }
  }

}