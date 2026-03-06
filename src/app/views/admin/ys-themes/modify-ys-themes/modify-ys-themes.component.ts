import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modify-ys-themes',
  templateUrl: './modify-ys-themes.component.html',
  styleUrls: ['./modify-ys-themes.component.scss']
})

export class ModifyYsThemesComponent implements OnInit {

  pageLoader: boolean; params: any;
  tForm: any = {}; maxRank: number = 0;
  imgBaseUrl = environment.img_baseurl; fileList: FormData;
  currencyList: any = []; euroRates: any = [];

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, public commonService: CommonService, private api: AdminApiService
  ) {
    if(localStorage.getItem("euro_rates")) {
      this.euroRates = this.commonService.decryptData(localStorage.getItem("euro_rates"));
    }
  }
  
  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.currencyList = this.commonService.currency_types.filter(obj => obj.store_base);
      this.commonService.redirect = "/admin/themes";
      this.params = params;
      this.maxRank = parseFloat(params.rank);
      this.tForm = { rank: this.maxRank, categories: [{}], image_list: [{}] };
      // edit
      if(params.id && params.rank) {
        this.pageLoader = true;
        this.api.THEMES_DETAILS(params.id).subscribe(result => {
          this.pageLoader = false;
          if(result.status) {
            this.tForm = result.data;
            this.tForm.prev_rank = this.tForm.rank;
            if(this.tForm.currency_types) {
              this.currencyList.forEach((el: any) => {
                if(this.tForm.currency_types[el.base]) {
                  el.selling_amount = this.tForm.currency_types[el.base].selling_amount;
                  el.amount = this.tForm.currency_types[el.base].amount;
                }
              });
            }
          }
          else console.log("response", result);
        });
      }
    })
  }

  onSubmit() {
    delete this.tForm.errorMsg;
    this.tForm.submit = true;
    let themeData: any = {};
    for(let key in this.tForm) {
      if (this.tForm.hasOwnProperty(key)) themeData[key] = this.tForm[key];
    }
    this.fileList = new FormData();
    this.onSetFormData("img_list", themeData.image_list).then((imgList) => {
      themeData.image_list = imgList;
      this.onSetFormData("cat_list", themeData.categories).then((catList) => {
        themeData.categories = catList;
        // currency type
        let currencyTypes: any = {};
        this.currencyList.forEach((element: any) => {
          currencyTypes[element.base] = {
            amount: parseFloat(element.amount), selling_amount: parseFloat(element.selling_amount)
          };
        });
        themeData.currency_types = currencyTypes;
        // append form data
        this.fileList.append('data', JSON.stringify(themeData));
        this.onCallApi();
      });
    });
  }

  onCallApi() {
    if(this.params.id) {
      this.api.THEMES_UPDATE(this.fileList).subscribe((result) => {
        this.tForm.submit = false;
        if(result.status) this.router.navigate(['/admin/themes']);
        else {
          this.tForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.THEMES_ADD(this.fileList).subscribe((result) => {
        this.tForm.submit = false;
        if(result.status) this.router.navigate(['/admin/themes']);
        else {
          this.tForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  fileChangeListener(index, event, type) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let fileData = event.target.files[0];
      reader.onload = (event: ProgressEvent) => {
        if(type=='theme') {
          this.tForm.image_list[index].temp_img = (<FileReader>event.target).result;
          this.tForm.image_list[index].image = fileData;
          this.tForm.image_list[index].img_change = true;
        }
        else {
          this.tForm.categories[index].temp_img = (<FileReader>event.target).result;
          this.tForm.categories[index].image = fileData;
          this.tForm.categories[index].img_change = true;
        }
      }
      reader.readAsDataURL(fileData);
    }
  }

  onSetFormData(type, imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++) {
        let imgData = imgList[i];
        if(imgData.img_change) {
          if(type=='img_list') this.fileList.append('attachments_1', imgData['image'], i+'_lis');
          if(type=='cat_list') this.fileList.append('attachments_2', imgData['image'], i+'_cat');
        }
        let objData = {};
        if(imgData.img_change) {
          for(let key in imgData) {
            if(imgData.hasOwnProperty(key) && key!='temp_img' && key!='image') {
              objData[key] = imgData[key];
            }
          }
        }
        else objData = imgData;
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  onResetPrice() {
    let cInd = this.currencyList.findIndex(el => el.base=='INR');
    if(cInd != -1) {
      let basePricing = this.currencyList[cInd];
      for(let el of this.currencyList) {
        if(el.base != 'INR') {
          el.selling_amount = Math.ceil((basePricing.selling_amount / this.euroRates["INR"]) * this.euroRates[el.base]);
          el.amount = Math.ceil((basePricing.amount / this.euroRates["INR"]) * this.euroRates[el.base]);
        }
      }
    }
  }

}