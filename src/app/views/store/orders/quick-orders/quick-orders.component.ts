import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../order.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';
import { Share } from '@capacitor/share';

@Component({
    selector: 'app-quick-orders',
    templateUrl: './quick-orders.component.html',
    styleUrls: ['./quick-orders.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class QuickOrdersComponent implements OnInit {

  page = 1; pageSize = 10;
  parentList: any = []; list: any = [];
  search_bar: any; list_type: string = 'all';
  deleteForm: any; pageLoader: boolean;
  tempFilter: any = {}; selectedItem:any; filterForm: any = {};
    status_list : any = [
    {name : 'All', value : 'all'},
    {name : 'Active', value : 'active'},
    {name : 'Inactive', value : 'inactive'}
  ]

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: OrderService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }
  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }   
    this.selectedItem = "Status";
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  ngOnInit(): void {
    this.pageLoader = true;
    this.api.QUICK_ORDER_LIST().subscribe(result => {
      if(result.status) {
        this.parentList = result.list;
        this.parentList.forEach((obj, index) => {
          obj.listIndex = index;
          obj.item_names = [];
          obj.item_list.forEach(prod => {
            if(obj.item_names.indexOf(prod.name)==-1) obj.item_names.push(prod.name);
          });
          obj.expired = false;
          if(obj.expiry_status && obj.expiry_on) {
            if(new Date() > new Date(obj.expiry_on)) obj.expired = true;
          }
        });
        this.onTypeChange(this.list_type);
        this.filterForm.list_type = "all";
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onTypeChange(x) {
    if(x=='active') this.list = this.parentList.filter(obj => obj.status==x && !obj.expired);
    else if(x=='inactive') this.list = this.parentList.filter(obj => obj.status==x || obj.expired);
    else this.list = this.parentList;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();     
  }

  onDelete() {
    this.api.DELETE_QUICK_ORDER(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  onUpdateStatus() {
    let status = "active";
    if(this.deleteForm.status=='active') status = "inactive";
    let formData = { _id: this.deleteForm._id, status: status };
    this.api.UPDATE_QUICK_ORDER(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  socialShare(selectedIndex, id) {
    if(environment.keep_login) {
      Share.share({
        title: '', text: '', dialogTitle: '',
        url: this.commonService.store_details.base_url+'/checkout/quick-order/'+id
      });
    }
    else {
      if(!this.commonService.isDesktop) {
        let windowNav: any = window.navigator;
        if(windowNav && windowNav.share) {
          windowNav.share({
            title: '', text: '',
            url: this.commonService.store_details.base_url+'/checkout/quick-order/'+id
          })
          .catch( (error) => { console.log(error); });
        }
        else console.log("share not supported")
      }
      else {
        this.commonService.copyLink = false;
        let qInd = this.list.findIndex(qo => qo.listIndex == selectedIndex);
        if(qInd!=-1) {
          this.list.forEach((el, index) => { if(qInd != index) delete el.share; });
          this.list[qInd].share = !this.list[qInd].share;
        }
      }
    }
  }

}