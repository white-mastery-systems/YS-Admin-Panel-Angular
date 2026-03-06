import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminApiService } from '../../../../services/admin-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-modify-ys-features',
  templateUrl: './modify-ys-features.component.html',
  styleUrls: ['./modify-ys-features.component.scss']
})

export class ModifyYsFeaturesComponent implements OnInit {

  pageLoader: boolean; featureForm: any = { image_list: [] };
  currencyList: any = [];
  discountCurrencyList: any =[];
  packageList: any = [];
  params: any = {};
  imgBaseUrl = environment.img_baseurl;
  euroRates: any = [];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private adminApi: AdminApiService, public commonService: CommonService) {
    if(localStorage.getItem("euro_rates")) {
      this.euroRates = this.commonService.decryptData(localStorage.getItem("euro_rates"));
    }
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.currencyList = this.commonService.currency_types.filter(obj => obj.store_base);
      this.params = params; this.discountCurrencyList = [];
        // packages
        this.commonService.admin_packages.forEach(obj => {
          let currencies = [];
          this.currencyList.forEach(element => {
            currencies.push({ base: element.base })
          });
          this.packageList.push({ _id: obj._id, name: obj.name, rank: obj.rank, currency_list: currencies });
        });
        // discount
        this.currencyList.forEach(element => {
          this.discountCurrencyList.push({ base: element.base })
        });
        // EDIT
        if(this.params.id) {
          this.pageLoader = true;
          this.adminApi.FEATURE_DETAILS(this.params.id).subscribe(result => {
            setTimeout(() => { this.pageLoader = false; }, 500);
            if(result.status) {
              this.featureForm = result.data;
              if(this.featureForm.linked_packages.length) {
                this.featureForm.link_to_package = true;
                this.packageList.forEach(pack => {
                  let packIndex = this.featureForm.linked_packages.findIndex(obj => obj.package_id==pack._id);
                  if(packIndex!=-1) {
                    pack.package_selected = true;
                    let currencyPrices = this.featureForm.linked_packages[packIndex].currency_types;
                    pack.currency_list.forEach(cur => {
                      cur.price = 0;
                      if(currencyPrices[cur.base]?.price) {
                        cur.price = currencyPrices[cur.base].price;
                      }
                    });
                  }
                });
              }
              if(this.featureForm.disc_status) {
                this.discountCurrencyList.forEach(element => {
                  element.price = this.featureForm.disc_currency_types[element.base].price;
                });
                this.featureForm.disc_from = new Date(this.featureForm.disc_from);
                this.featureForm.disc_to = new Date(this.featureForm.disc_to);
              }
            }
            else console.log("response", result);
          });
        }
    });
  }

  onSubmit() {
    this.featureForm.linked_packages = [];
    this.packageList.forEach(element => {
      if(element.package_selected) {
        let currencyTypes: any = {};
        element.currency_list.forEach(obj => {
          currencyTypes[obj.base] = { price: parseFloat(obj.price) };
        });
        this.featureForm.linked_packages.push({ package_id: element._id, currency_types: currencyTypes });
      }
    });
    this.featureForm.disc_currency_types = {};
    if(this.featureForm.disc_status) {
      this.discountCurrencyList.forEach(element => {
        this.featureForm.disc_currency_types[element.base] = { price: parseFloat(element.price) };
      });
    }
    if(this.params.id) {
      this.adminApi.UPDATE_FEATURE(this.featureForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/features']);
        else {
          this.featureForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.adminApi.ADD_FEATURE(this.featureForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/features']);
        else {
          this.featureForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  onResetPrice(currList) {
    let cInd = currList.findIndex(el => el.base=='INR');
    if(cInd != -1) {
      let basePricing = currList[cInd];
      for(let el of currList) {
        if(el.base != 'INR') {
          el.price = Math.ceil((basePricing.price / this.euroRates["INR"]) * this.euroRates[el.base]);
        }
      }
    }
  }

  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.featureForm.image_list[index].image = (<FileReader>event.target).result;
        this.featureForm.image_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}