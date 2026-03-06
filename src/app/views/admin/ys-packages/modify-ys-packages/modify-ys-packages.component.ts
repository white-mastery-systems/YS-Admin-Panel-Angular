import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminApiService } from '../../../../services/admin-api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-modify-ys-packages',
  templateUrl: './modify-ys-packages.component.html',
  styleUrls: ['./modify-ys-packages.component.scss']
})

export class ModifyYsPackagesComponent implements OnInit {

  pageLoader: boolean; packageForm: any = {}; params: any = {};
  currency_list: any = [];
  monthList: any = ["1", "3", "6", "12"];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.currency_list = this.commonService.currency_types.filter(obj => obj.store_base);
      this.params = params;
        // EDIT
        if(this.params.id) {
          this.pageLoader = true;
          this.adminApi.PACKAGE_DETAILS(this.params.id).subscribe(result => {
            setTimeout(() => { this.pageLoader = false; }, 500);
            if(result.status) {
              this.packageForm = result.data;
              this.currency_list.forEach(element => {
                if(this.packageForm.currency_types[element.base]) {
                  element.pricing = this.packageForm.currency_types[element.base];
                }
                else {
                  element.pricing = {};
                  this.monthList.forEach(m => { element.pricing[m] = {}; });
                }
              });
            }
            else console.log("response", result);
          });
        }
        else {
          this.currency_list.forEach(element => {
            element.pricing = {};
            this.monthList.forEach(m => { element.pricing[m] = {}; });
          });
        }
    });
  }

  onSubmit() {
    let currencyTypes: any = {};
    for(let element of this.currency_list)
    {
      let priceInfo = element.pricing;
      currencyTypes[element.base] = { transaction_limit: parseFloat(priceInfo.transaction_limit) };
      this.monthList.forEach(m => {
        currencyTypes[element.base][m] = {
          amount: parseFloat(priceInfo[m].amount), selling_amount: parseFloat(priceInfo[m].selling_amount)
        };
      });
    }
    this.packageForm.currency_types = currencyTypes;
    if(this.params.id) {
      // update
      this.adminApi.UPDATE_PACKAGE(this.packageForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/packages']);
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      // add
      this.adminApi.ADD_PACKAGE(this.packageForm).subscribe(result => {
        if(result.status) this.router.navigate(['/admin/packages']);
        else {
          this.packageForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

}