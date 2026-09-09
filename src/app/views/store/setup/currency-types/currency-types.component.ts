import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetupService } from '../setup.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-currency-types',
    templateUrl: './currency-types.component.html',
    styleUrls: ['./currency-types.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class CurrencyTypesComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = [];
	addForm: any; editForm: any; deleteForm: any;
  pageLoader: boolean; search_bar: string;
  popupLoader: boolean; ysCurrencyList: any = [];

	constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: SetupService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Currency Convertor";
    }
    this.pageLoader = true;
    this.api.YS_CURRENCY_LIST().subscribe(result => {
      if(result.status) {
        this.ysCurrencyList = result.list;
        this.commonService.ys_currency_list = result.list.map((item: any) => ({ name: item.name }));
        this.commonService.updateLocalData('ys_currency_list', this.commonService.ys_currency_list);
        this.getCurrencyList();
      }
    });
  }

  getCurrencyList() {
    this.pageLoader = true;
    this.api.STORE_CURRENCY_LIST().subscribe(result => {
			if(result.status) {
        this.list = result.list;
        let currencyIndex = this.list.findIndex(obj => obj.default_currency);
        let storeCurrency = this.list[currencyIndex].country_code;
        this.list.forEach(element => {
          let liveIndex = this.ysCurrencyList.findIndex(obj => obj.name==element.country_code);
          element.inr_rate = parseFloat(this.ysCurrencyList[liveIndex].rates[storeCurrency].toFixed(2));
        });
      }
			else console.log("response", result);
			setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // ADD
	onAdd() {
    this.addForm.country_code = this.addForm.country.name;
    this.addForm.html_code = this.addForm.country.html_code;
		this.api.ADD_STORE_CURRENCY(this.addForm).subscribe(result => {
			if(result.status) {
				document.getElementById('closeModal').click();
				this.getCurrencyList();
			}
			else {
				this.addForm.errorMsg = result.message;
				console.log("response", result);
			}
		});
  }

	// EDIT
  onEdit(x, modalName) {
    this.popupLoader = true; this.editForm = {};
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable : true });
    this.api.STORE_CURRENCY_LIST().subscribe(result => {
      if(result.status) {
        let index = result.list.findIndex(obj => obj._id==x._id);
        if(index!=-1) {
          this.editForm = result.list[index];
          this.popupLoader = false;
        }
        else console.log("Invalid currency type");
      }
      else console.log("response", result);
    });
  }

  // UPDATE
	onUpdate() {
		this.api.UPDATE_STORE_CURRENCY(this.editForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCurrencyList();
      }
      else {
				this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }
  
  // DELETE
  onDelete() {
    this.api.DELETE_STORE_CURRENCY(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.getCurrencyList();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

}